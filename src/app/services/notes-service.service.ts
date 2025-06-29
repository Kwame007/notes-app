import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Note } from '../utilities/note.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotesServiceService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

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
      .eq('user_id', user.id);
    if (error) throw new Error(error.message);
    return data;
  }

  async updateNote(id: number, changes: Partial<Note>): Promise<Note[] | null> {
    const { data, error } = await this.supabaseService.client
      .from('notes')
      .update({ content: changes.content, title: changes.title })
      .eq('id', id);
    if (error) throw new Error(error.message);
    return data;
  }

  async createNote(note: Note): Promise<Note | null> {
    const { data, error } = await this.supabaseService.client
      .from('notes')
      .insert(note)
      .select()
      .single();
    console.log('createNote', data, error);
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteNote(id: number): Promise<Note[] | null> {
    const { data, error } = await this.supabaseService.client.from('notes').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data;
  }

  async getNoteById(id: string): Promise<Note | null> {
    const { data, error } = await this.supabaseService.client
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
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
