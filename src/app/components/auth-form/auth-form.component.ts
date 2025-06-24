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
  user: any = null; // Replace 'any' with your actual user type
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
      // Handle signup
      this.authService
        .signUp(this.formData.email, this.formData.password)
        .then((data) => {
          // set login state to true
          this.isLogin = true;
          this.user = data.user;
          this.errorMessage = '';
          console.log('Signup successful:', data);
        })
        .catch((error) => {
          this.isLogin = false;
          this.errorMessage = error.message || 'Signup failed. Please try again.';
          console.error('Signup error:', error);
        });
      console.log('Signup data:', this.formData);
    } else {
      // Handle login
      this.authService
        .login(this.formData.email, this.formData.password)
        .then((data) => {
          this.isLogin = true;
          this.user = data.user;
          this.errorMessage = '';
          console.log('Login successful:', data);
        })
        .catch((error) => {
          this.isLogin = false;
          this.errorMessage = error.message || 'Login failed. Please try again.';
          console.error('Login error:', error);
        });
      console.log('Login data:', this.formData);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.isLogin = false;
      this.user = null; // Reset user state
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
