import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Note } from '../utilities/note.model';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesServiceService {
  private notesUpdatedSubject = new BehaviorSubject<void>(undefined);
  public notesUpdated$ = this.notesUpdatedSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  private notifyNotesUpdated() {
    this.notesUpdatedSubject.next();
  }

  async getNotes(): Promise<Note[] | null> {
    if (!this.authService.isLoggedIn) {
      throw new Error('User not authenticated');
    }

    const user = await this.authService.getCurrentUser();
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabaseService.client
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    // Map snake_case fields to camelCase if needed
    if (data) {
      return data.map((note) => ({
        ...note,
        isArchived: note.is_archived || note.isArchived || false,
      }));
    }

    return data;
  }

  async updateNote(id: string, changes: Partial<Note>): Promise<Note[] | null> {
    const { error } = await this.supabaseService.client
      .from('notes')
      .update(changes)
      .eq('id', Number(id));
    if (error) {
      throw new Error(error.message);
    }

    // Return the updated notes list
    const updatedNotes = await this.getNotes();
    this.notifyNotesUpdated();
    return updatedNotes;
  }

  async createNote(note: Note): Promise<Note | null> {
    const { data, error } = await this.supabaseService.client
      .from('notes')
      .insert(note)
      .select()
      .single();
    if (error) throw new Error(error.message);
    this.notifyNotesUpdated();
    return data;
  }

  async deleteNote(id: string): Promise<Note[] | null> {
    const { error } = await this.supabaseService.client.from('notes').delete().eq('id', Number(id));
    if (error) throw new Error(error.message);

    // Return the updated notes list
    const updatedNotes = await this.getNotes();
    this.notifyNotesUpdated();
    return updatedNotes;
  }

  async getNoteById(id: string): Promise<Note | null> {
    if (!id || id === 'new') {
      return null;
    }

    const { data, error } = await this.supabaseService.client
      .from('notes')
      .select('*')
      .eq('id', Number(id))
      .single();
    if (error) throw new Error(error.message);

    // Map snake_case fields to camelCase if needed
    if (data) {
      return {
        ...data,
        isArchived: data.is_archived || data.isArchived || false,
      };
    }

    return data;
  }

  async getArchivedNotes(): Promise<Note[] | null> {
    if (!this.authService.isLoggedIn) {
      throw new Error('User not authenticated');
    }

    const user = await this.authService.getCurrentUser();
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabaseService.client
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('isArchived', true);
    if (error) throw new Error(error.message);
    return data;
  }
}
