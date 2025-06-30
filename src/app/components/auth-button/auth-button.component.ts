import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
  imports: [CommonModule],
})
export class AuthButtonComponent {
  @Input({ required: true }) isLoggedIn: boolean = false;
  authService = inject(AuthService);
  router = inject(Router);

  async logOut() {
    try {
      await this.authService.logOut();
      this.router.navigate(['/login']);
    } catch (error) {
      // Handle error silently
    }
  }
}
