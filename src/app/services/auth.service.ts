import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
    });

    if (data?.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async logout() {
    const { error } = await this.supabaseService.client.auth.signOut();

    localStorage.removeItem('user');

    if (error) {
      throw new Error(error.message);
    }
  }

  async getUser() {
    const { data, error } = await this.supabaseService.client.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    return data.user || null;
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return !!user;
  }

  async getUserId(): Promise<string | null> {
    const user = await this.getUser();
    return user ? user.id : null;
  }
}
