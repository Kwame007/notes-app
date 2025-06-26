import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Checking authentication for route:', state.url);

  // First check if we have a session stored locally
  if (!authService.isLoggedIn) {
    console.log('AuthGuard: No local session found, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  // Validate the session with Supabase to ensure it's still valid
  try {
    const isValidSession = await authService.validateSession();
    if (!isValidSession) {
      console.log('AuthGuard: Session validation failed, redirecting to login');
      router.navigate(['/login']);
      return false;
    }

    console.log('AuthGuard: Authentication successful');
    return true;
  } catch (error) {
    console.error('AuthGuard: Error validating session:', error);
    router.navigate(['/login']);
    return false;
  }
};
