import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { AuthService } from './services/auth.service';
import { NotesServiceService } from './services/notes-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'note-app';
  notes = [];
  isAuthenticated = false;
  loading = true;
  private authSubscription?: Subscription;

  constructor(
    private noteService: NotesServiceService,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('AppComponent constructor', this.notes);
  }

  ngOnInit() {
    // this.authSubscription = this.authService.authState$.subscribe((isAuthenticated) => {
    //   this.isAuthenticated = isAuthenticated;
    //   const currentUrl = this.router.url;

    //   if (!isAuthenticated) {
    //     if (currentUrl !== '/login') {
    //       this.router.navigate(['/login']);
    //     }
    //   } else {
    //     if (!currentUrl.startsWith('/notes')) {
    //       this.router.navigate(['/notes']);
    //     }
    //   }
    // });
    // this.authService.getUser();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
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

  logOut() {
    this.authService
      .logOut()
      .then(() => {
        console.log('Logged out successfully');
        this.router.navigate(['/login']);
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

  // async create() {
  //   const user = await this.authService.getUser();
  //   const userId = user?.id;
  //   if (!userId) {
  //     console.error('Cannot create note: user not authenticated');
  //     return;
  //   }
  //   const newNote = {
  //     user_id: userId,
  //     title: 'New Service',
  //     content: 'Newly created notes',
  //     tags: [],
  //     isArchived: false,
  //   };
  //   this.noteService
  //     .createNote(newNote)
  //     .then((createdNote: any) => {
  //       console.log('Note created:', createdNote);
  //     })
  //     .catch((error: any) => {
  //       console.error('Error creating note:', error);
  //     });
  // }
}
