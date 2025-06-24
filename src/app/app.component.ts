import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotesServiceService } from './services/notes-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private noteService:NotesServiceService) {}
  title = 'note-app';

  ngOnInit() {
    this.noteService.read().then(notes => {
      console.log('Notes fetched:', notes);
    }).catch(error => {
      console.error('Error fetching notes:', error);
    });
  }

  // Example of updating a note
  updateNote() {
    const id = 1; // Replace with the actual note ID
    const newContent = {title:'Updated Service', content:"Newly updated notes"}; // Replace with the new content

    this.noteService.update(id, newContent).then(updatedNote => {
      console.log('Note updated:', updatedNote);
    }).catch(error => {
      console.error('Error updating note:', error);
    });
  }

  login() {
    console.log('Login button clicked');
    // Implement login logic or navigation here
  }

  signup() {
    console.log('Sign Up button clicked');
    // Implement signup logic or navigation here
  }

  delete(id: number) {
    this.noteService.delete(id).then(() => {
      console.log('Note deleted successfully');
    }).catch(error => {
      console.error('Error deleting note:', error);
    });
    // Implement delete logic here
    // For example, you can call a method in NotesServiceService to delete the note
  }

  create() {
    const newNote = {title:'New Service', content:"Newly created notes"}; // Replace with the actual note content
    this.noteService.create(newNote).then(createdNote => {
      console.log('Note created:', createdNote);
    }).catch(error => {
      console.error('Error creating note:', error);
    });
  }
}
