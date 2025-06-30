import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const isValid = await authService.validateSession();
    if (!isValid) {
      router.navigate(['/login']);
      return false;
    }
    return true;
  } catch (error) {
    router.navigate(['/login']);
    return false;
  }
};
