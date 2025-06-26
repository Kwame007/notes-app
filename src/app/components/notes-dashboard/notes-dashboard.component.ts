import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesServiceService } from '../../services/notes-service.service';
import { Note } from '../../utilities/note.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-dashboard.component.html',
  styleUrl: './notes-dashboard.component.scss',
})
export class NotesDashboardComponent implements OnInit {
  notes: Note[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private notesService: NotesServiceService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const notes = await this.notesService.getNotes();
      this.notes = notes ? notes.filter((n) => !n.isArchived) : [];
    } catch (err: any) {
      this.error = err.message || 'Failed to load notes.';
    } finally {
      this.loading = false;
    }
  }

  onNoteClick(note: Note) {
    this.router.navigate(['/notes', note.id]);
  }

  onCreateNoteClick() {
    this.router.navigate(['/create']);
  }
}
