import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-form',
  imports: [FormsModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
  isSignup = false;
  isLogin = false;
  user: any = null;
  errorMessage: string = '';

  formData = {
    email: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  toggleForm() {
    this.isSignup = !this.isSignup;
    this.errorMessage = '';
  }

  onSubmit(form: any) {
    if (form.invalid) return;
    this.errorMessage = '';
    if (this.isSignup) {
      this.authService
        .signUp(this.formData.email, this.formData.password)
        .then((data) => {
          this.isLogin = true;
          this.user = data.user;
          this.errorMessage = '';
        })
        .catch((error) => {
          this.isLogin = false;
          this.errorMessage = error.message || 'Signup failed. Please try again.';
        });
    } else {
      this.authService
        .login(this.formData.email, this.formData.password)
        .then((data) => {
          this.isLogin = true;
          this.user = data.user;
          this.errorMessage = '';
        })
        .catch((error) => {
          this.isLogin = false;
          this.errorMessage = error.message || 'Login failed. Please try again.';
        });
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.isLogin = false;
      this.user = null; 
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
