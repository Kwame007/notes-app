import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Note } from '../../utilities/note.model';
import { NoteCardComponent } from '../notes-card/notes-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthButtonComponent } from '../auth-button/auth-button.component';
import { AuthService } from '../../services/auth.service';
import { NotesServiceService } from '../../services/notes-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-note-sidebar',
  templateUrl: './notes-sidebar.component.html',
  styleUrls: ['./notes-sidebar.component.scss'],
  imports: [NoteCardComponent, FormsModule, CommonModule, AuthButtonComponent],
})
export class NoteSidebarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  constructor(
    private authService: AuthService,
    private notesService: NotesServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  notes: Note[] = [];
  userId: string = '';
  isLoading: boolean = false;

  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  private notesUpdateSubscription: Subscription | undefined;
  private searchSubscription: Subscription | undefined;

  @Output() selectNote = new EventEmitter<string>();
  @Output() createNote = new EventEmitter<void>();
  @Output() deleteNote = new EventEmitter<string>();
  @Output() archiveNote = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;

    this.authService.getCurrentUser().then((user) => {
      this.userId = user?.id || '';
    });

    this.loadNotes();

    // Subscribe to notes updates to refresh the list
    this.notesUpdateSubscription = this.notesService.notesUpdated$.subscribe(() => {
      this.loadNotes();
    });

    // Set up search debouncing
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.searchQuery = query;
        this.searchChange.emit(query);
      });
  }

  ngOnDestroy() {
    if (this.notesUpdateSubscription) {
      this.notesUpdateSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadNotes() {
    this.isLoading = true;
    this.notesService
      .getNotes()
      .then((notes) => {
        this.isLoading = false;
        if (notes) {
          this.notes = notes;

          // If no notes exist, navigate to new note
          if (this.notes.length === 0) {
            this.router.navigate(['/notes/new']);
          }
        }
      })
      .catch((error) => {
        this.isLoading = false;
      });
  }

  get selectedNoteId(): string {
    const params = this.route.snapshot.firstChild?.params || this.route.snapshot.params;
    const noteId = params['id'];
    return noteId && noteId !== 'new' ? noteId : '';
  }

  get selectedNote(): Note | undefined {
    return this.notes.find((note) => String(note.id) === String(this.selectedNoteId));
  }

  get filteredNotes(): Note[] {
    if (!this.searchQuery.trim()) {
      return this.notes;
    }

    const query = this.searchQuery.toLowerCase().trim();
    return this.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
    );
  }

  createNewNote() {
    this.router.navigate(['/notes/new']);
    this.createNote.emit();
  }

  get activeNotes(): Note[] {
    return this.filteredNotes.filter((note) => !note.is_archived);
  }

  get archivedNotes(): Note[] {
    return this.filteredNotes.filter((note) => note.is_archived);
  }

  handleSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  updateNote({ id, updates }: { id: string; updates: Partial<Note> }) {
    this.notesService
      .updateNote(id, updates)
      .then((updatedNotes) => {
        if (updatedNotes) {
          // The notesUpdated$ subscription will trigger loadNotes() which will handle updates
        }
      })
      .catch((error) => {
        // Handle error silently
      });
  }

  deleteNoteHandler(id: string) {
    this.notesService
      .deleteNote(id)
      .then((deletedNotes) => {
        if (deletedNotes) {
          // Always navigate to new note page after deletion
          this.router.navigate(['/notes/new']);
          this.deleteNote.emit(id);
        }
      })
      .catch((error) => {
        // Handle error silently
      });
  }

  archiveNoteHandler(id: string) {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return;

    const updates = {
      is_archived: !note.is_archived,
      updated_at: new Date().toISOString(),
    };

    this.notesService
      .updateNote(id, updates)
      .then((updatedNotes) => {
        if (updatedNotes && updatedNotes.length > 0) {
          // The notesUpdated$ subscription will trigger loadNotes() which will handle updates
          this.archiveNote.emit(id);
        }
      })
      .catch((error) => {
        // Handle error silently
      });
  }

  selectNoteHandler(id: string) {
    this.router.navigate(['/notes', id]);
    this.selectNote.emit(id);
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
  }

  isNoteSelected(noteId: string | undefined): boolean {
    if (!noteId) return false;
    return String(noteId) === String(this.selectedNoteId);
  }
}
