import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesServiceService } from '../../services/notes-service.service';
import { Note } from '../../utilities/note.model';

@Component({
  selector: 'app-archived-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archived-notes.component.html',
  styleUrl: './archived-notes.component.scss',
})
export class ArchivedNotesComponent {
  archivedNotes: Note[] = [];
  loading = true;
  error: string = '';

  constructor(private notesService: NotesServiceService) {
    this.fetchArchivedNotes();
  }

  async fetchArchivedNotes() {
    this.loading = true;
    this.error = '';
    try {
      const notes = await this.notesService.getArchivedNotes();
      this.archivedNotes = notes || [];
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load archived notes.';
    } finally {
      this.loading = false;
    }
  }

  async restoreNote(note: Note) {
    if (!note.id) return;
    try {
      await this.notesService.updateNote(Number(note.id), { isArchived: false });
      this.archivedNotes = this.archivedNotes.filter((n) => n.id !== note.id);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to restore note.';
    }
  }
}
