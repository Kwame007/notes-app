import { Component, OnInit } from '@angular/core';
import { NoteSidebarComponent } from '../notes-sidebar/notes-sidebar.component';
import { NoteEditorComponent } from '../notes-editor/notes-editor.component';
import { FormsModule } from '@angular/forms';
import { Note } from '../../../models/notes.model';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { NotesServiceService } from '../../services/notes-service.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-note-page',
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.scss'],
  imports: [NoteSidebarComponent, FormsModule, CommonModule, RouterOutlet],
})
export class NotePageComponent {
  constructor(
    private notesService: NotesServiceService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  userId: string = '';
  selectedNoteId: string = '';
  searchQuery: string = '';

  ngOnInit() {
    this.authService.getCurrentUser().then((user) => {
      this.userId = user?.id || '';
    });
  }

  onSelectNote(noteId: string) {
    this.selectedNoteId = noteId;
    this.router.navigate(['/notes', noteId]);
  }

  onCreateNote() {
    this.router.navigate(['/notes/new']);
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
  }
}
