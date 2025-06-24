import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class NotesServiceService {
  private notes = [];

  constructor(private supabaseService:SupabaseService) { }

  async read() {
    try {
      const { data, error } = await this.supabaseService.client
        .from('notes')
        .select('*')
      if (error) {
        throw new Error(error.message);
      }
      console.log('Notes fetched successfully:', data);
      // this.notes = data;
      return data;
    } catch (error) {
      console.error('Error reading notes:', error);
      throw error;
    }
  }

  async update(id: number, changes: any) {
    try {
      const { data, error } = await this.supabaseService.client
        .from('notes')
        .update({ content: changes.content, title: changes.title })
        .eq('id', id)
      if (error) {
        throw new Error(error.message);
      }
      console.log('Note updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  async create(note: any) {
    try {
      const { data, error } = await this.supabaseService.client
        .from('notes')
        .insert(note)
      if (error) {
        throw new Error(error.message);
      }
      console.log('Note created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const { data, error } = await this.supabaseService.client
        .from('notes')
        .delete()
        .eq('id', id)
      if (error) {
        throw new Error(error.message);
      }
      console.log('Note deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}
