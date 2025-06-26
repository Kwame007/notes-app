import { Injectable } from '@angular/core';
import { NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private _ngZone = inject(NgZone);

  constructor(private supabaseService: SupabaseService) {
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {

      // store session in localstorage
      if (session?.user) {
        localStorage.setItem('session', JSON.stringify(session.user));
        // Only navigate to notes if we're currently on login/register page
        this._ngZone.run(() => {
          const currentUrl = this.router.url;
          if (currentUrl === '/login' || currentUrl === '/register') {
            this.router.navigate(['/notes']);
          }
        });
      } else {
        // Clear session when user is not authenticated
        localStorage.removeItem('session');
      }
    });
  }

  signUp(email: string, password: string) {
    return this.supabaseService.client.auth.signUp({ email, password });
  }

  login(email: string, password: string) {
    return this.supabaseService.client.auth.signInWithPassword({ email, password });
  }

  get isLoggedIn(): boolean {
    const sessionData = localStorage.getItem('session');
    if (!sessionData || sessionData === 'null' || sessionData === 'undefined') {
      return false;
    }

    try {
      const user = JSON.parse(sessionData);
      return !!user && !!user.id;
    } catch {
      return false;
    }
  }

  async signInWithGoogle() {
    this.supabaseService.client.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  async logOut() {
    await this.supabaseService.client.auth.signOut();
    localStorage.removeItem('session');
  }

  // Get current user from Supabase (for validation)
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await this.supabaseService.client.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  }

  // Validate if the stored session is still valid
  async validateSession(): Promise<boolean> {
    console.log('AuthService: Validating session...');
    const {
      data: { session },
      error,
    } = await this.supabaseService.client.auth.getSession();

    if (error) {
      console.error('AuthService: Session validation error:', error);
      localStorage.removeItem('session');
      return false;
    }

    if (!session) {
      console.log('AuthService: No active session found');
      localStorage.removeItem('session');
      return false;
    }

    console.log('AuthService: Session validation successful');
    return true;
  }
}
