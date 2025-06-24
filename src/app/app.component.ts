import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { AuthService } from './services/auth.service';
import { NotesServiceService } from './services/notes-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'note-app';
  notes = [];
  isAuthenticated = false;
  loading = true;

  constructor(
    private noteService: NotesServiceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.authService.getUser().then((user) => {
      if (user) {
        this.isAuthenticated = true;

        this.noteService
          .getNotes()
          .then((notes: any) => {
            this.notes = notes;
          })
          .catch((error: any) => {
            console.error('Error fetching notes:', error);
          });
      } else {
        this.isAuthenticated = false;
        console.log('User is not authenticated');
      }
      this.loading = false;
    });
  }

  updateNote() {
    const id = 13; // Replace with the actual note ID
    const newContent = {
      title: 'Updated Service',
      content: 'Newly updated notes',
    };

    this.noteService
      .updateNote(id, newContent)
      .then((updatedNote: any) => {
        console.log('Note updated:', updatedNote);
      })
      .catch((error: any) => {
        console.error('Error updating note:', error);
      });
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.isAuthenticated = false;
        console.log('User logged out successfully');
      })
      .catch((error: any) => {
        console.error('Error logging out:', error);
      });
  }

  delete(id: number) {
    this.noteService
      .deleteNote(id)
      .then(() => {
        console.log('Note deleted successfully');
      })
      .catch((error: any) => {
        console.error('Error deleting note:', error);
      });
  }

  async create() {
    const user = await this.authService.getUser();
    const userId = user?.id;
    if (!userId) {
      console.error('Cannot create note: user not authenticated');
      return;
    }
    const newNote = {
      user_id: userId,
      title: 'New Service',
      content: 'Newly created notes',
      tags: [],
      isArchived: false,
    };
    this.noteService
      .createNote(newNote)
      .then((createdNote: any) => {
        console.log('Note created:', createdNote);
      })
      .catch((error: any) => {
        console.error('Error creating note:', error);
      });
  }
}
