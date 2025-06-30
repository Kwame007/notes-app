import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from '../../utilities/note.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesServiceService } from '../../services/notes-service.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note-editor',
  templateUrl: './notes-editor.component.html',
  styleUrls: ['./notes-editor.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class NoteEditorComponent implements OnInit, OnDestroy {
  note: Note | null = null;
  title: string = '';
  content: string = '';
  newTag: string = '';
  isNewNote: boolean = false;
  userId: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  hasUnsavedChanges: boolean = false;
  originalNote: Note | null = null;

  private routeSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesServiceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().then((user) => {
      this.userId = user?.id || '';
    });

    this.routeSubscription = this.route.params.subscribe((params) => {
      const noteId = params['id'];

      // Reset states
      this.isLoading = false;
      this.error = null;

      if (!noteId || noteId === 'new') {
        this.isNewNote = true;
        this.note = {
          id: '',
          title: '',
          content: '',
          tags: [],
          is_archived: false,
          user_id: this.userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        this.title = '';
        this.content = '';
      } else {
        this.isNewNote = false;
        this.isLoading = true;
        this.loadNote(noteId);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadNote(noteId: string) {
    this.notesService
      .getNoteById(noteId)
      .then((note) => {
        this.isLoading = false;
        if (note) {
          this.note = note;
          this.originalNote = { ...note }; // Store original state
          this.title = note.title;
          this.content = note.content;
          this.hasUnsavedChanges = false;
        } else {
          // Note not found, redirect to new note
          this.router.navigate(['/notes/new']);
        }
      })
      .catch((error) => {
        this.isLoading = false;
        this.error = 'Failed to load note. Please try again.';
      });
  }

  retryLoad() {
    this.error = null;
    this.isLoading = true;
    // Get the current note ID from the route
    const noteId = this.route.snapshot.params['id'];
    if (noteId && noteId !== 'new') {
      this.loadNote(noteId);
    } else {
      this.router.navigate(['/notes/new']);
    }
  }

  createNewNote() {
    this.router.navigate(['/notes/new']);
  }

  onTitleChange(newTitle: string) {
    this.title = newTitle;
    this.checkForChanges();
  }

  onContentChange(newContent: string) {
    this.content = newContent;
    this.checkForChanges();
  }

  saveNote() {
    if (this.isNewNote) {
      this.createNewNoteData();
    }
  }

  updateNote() {
    if (this.isNewNote || !this.note?.id) return;

    if (!this.title.trim()) {
      this.error = 'Please enter a title for your note.';
      return;
    }

    const updates = {
      title: this.title,
      content: this.content,
      tags: this.note.tags,
      updated_at: new Date().toISOString(),
    };

    this.isLoading = true;
    this.error = null;

    this.notesService
      .updateNote(this.note.id, updates)
      .then((updatedNotes) => {
        this.isLoading = false;
        if (updatedNotes && this.note) {
          this.note = { ...this.note, ...updates };
          this.originalNote = { ...this.note }; // Update original state
          this.hasUnsavedChanges = false; // Reset change tracking
          this.error = null;
        }
      })
      .catch((error) => {
        this.isLoading = false;
        this.error = 'Failed to update note. Please try again.';
      });
  }

  private createNewNoteData() {
    if (!this.title.trim()) {
      this.error = 'Please enter a title for your note.';
      return;
    }

    const newNoteData = {
      title: this.title,
      content: this.content,
      tags: this.note?.tags || [],
      is_archived: false,
      user_id: this.userId,
    };

    this.isLoading = true;
    this.error = null;

    this.notesService
      .createNote(newNoteData)
      .then((newNote) => {
        this.isLoading = false;
        if (newNote) {
          this.note = newNote;
          this.isNewNote = false;
          // Navigate to the new note - the sidebar will be notified via the service
          this.router.navigate(['/notes', newNote.id]);
        }
      })
      .catch((error) => {
        this.isLoading = false;
        this.error = 'Failed to create note. Please try again.';
      });
  }

  addTag() {
    const tag = this.newTag.trim();
    if (tag && this.note && !this.note.tags.includes(tag)) {
      const updatedTags = [...this.note.tags, tag];
      if (this.isNewNote) {
        this.note.tags = updatedTags;
      } else {
        this.note.tags = updatedTags;
        this.checkForChanges();
      }
      this.newTag = '';
    }
  }

  removeTag(tagToRemove: string) {
    if (this.note) {
      const updatedTags = this.note.tags.filter((tag) => tag !== tagToRemove);
      if (this.isNewNote) {
        this.note.tags = updatedTags;
      } else {
        this.note.tags = updatedTags;
        this.checkForChanges();
      }
    }
  }

  handleTagKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  formatDate(date: Date | string | undefined): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date || Date.now()));
  }

  private checkForChanges() {
    if (!this.originalNote || this.isNewNote) {
      this.hasUnsavedChanges = false;
      return;
    }

    const hasTitleChanged = this.title !== this.originalNote.title;
    const hasContentChanged = this.content !== this.originalNote.content;
    const hasTagsChanged =
      JSON.stringify(this.note?.tags) !== JSON.stringify(this.originalNote.tags);

    this.hasUnsavedChanges = hasTitleChanged || hasContentChanged || hasTagsChanged;
  }
}
