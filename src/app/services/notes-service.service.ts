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
    const userId = await this.authService.getUserId();

    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService.client
      .from('notes')
      .select('*')
      // .eq('user_id', userId);
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

  async createNote(note: Note): Promise<Note[] | null> {
    const { data, error } = await this.supabaseService.client.from('notes').insert(note);
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteNote(id: number): Promise<Note[] | null> {
    const { data, error } = await this.supabaseService.client.from('notes').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data;
  }
}
