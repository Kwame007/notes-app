import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { NotesServiceService } from '../../services/notes-service.service';
import { AuthService } from '../../services/auth.service';
import { Note } from '../../utilities/note.model';

@Component({
  selector: 'app-note-create',
  imports: [FormsModule, NgIf],
  templateUrl: './note-create.component.html',
  styleUrl: './note-create.component.scss',
})
export class NoteCreateComponent {
  noteTitle: string = '';
  noteTags: string = '';
  noteContent: string = '';
  isSaving: boolean = false;
  errorMessage: string = '';

  constructor(
    private notesService: NotesServiceService,
    private authService: AuthService,
    private router: Router
  ) {}

  async saveNote(): Promise<void> {
    if (!this.noteTitle.trim() && !this.noteContent.trim()) {
      this.errorMessage = 'Please enter a title or content for your note.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    try {
      const user = await this.authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      // Parse tags from comma-separated string
      const tags = this.noteTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const newNote: Note = {
        title: this.noteTitle.trim(),
        content: this.noteContent.trim(),
        tags: tags,
        isArchived: false,
        user_id: user.id,
      };

      await this.notesService.createNote(newNote);

      // Navigate back to the dashboard after successful creation
      this.router.navigate(['/notes']);
    } catch (error) {
      console.error('Error creating note:', error);
      this.errorMessage =
        error instanceof Error ? error.message : 'Failed to create note. Please try again.';
    } finally {
      this.isSaving = false;
    }
  }

  cancel(): void {
    // Navigate back to the dashboard
    this.router.navigate(['/notes']);
  }

  goBack(): void {
    // Navigate back to the dashboard
    this.router.navigate(['/notes']);
  }
}
