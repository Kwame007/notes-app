import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotesServiceService } from '../../services/notes-service.service';
import { Note } from '../../utilities/note.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.scss',
})
export class NoteDetailComponent implements OnInit {
  note: Note | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private notesService: NotesServiceService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        this.note = await this.notesService.getNoteById(id);
      } catch (err: any) {
        this.error = err.message || 'Failed to load note.';
      } finally {
        this.loading = false;
      }
    } else {
      this.error = 'No note ID provided.';
      this.loading = false;
    }
  }
}
