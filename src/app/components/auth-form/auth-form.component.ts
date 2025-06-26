import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-form',
  imports: [FormsModule],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  isSignup = false;
  isLogin = false;
  user: any = null;
  errorMessage: string = '';
  showPassword = false;

  model = {
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
        .signUp(this.model.email, this.model.password)
        .then((data) => {
          if (data.error) {
            this.isLogin = false;
            this.errorMessage = data.error.message || 'Signup failed. Please try again.';
          } else {
            this.isLogin = true;
            this.user = data.data.user;
            this.errorMessage = '';
          }
        })
        .catch((error) => {
          this.isLogin = false;
          this.errorMessage = error.message || 'Signup failed. Please try again.';
        });
    } else {
      this.authService
        .login(this.model.email, this.model.password)
        .then((data) => {
          if (data.error) {
            this.isLogin = false;
            this.errorMessage = data.error.message || 'Login failed. Please try again.';
          } else {
            this.isLogin = true;
            this.user = data.data.user;
            this.errorMessage = '';
          }
        })
        .catch((error) => {
          this.isLogin = false;
          this.errorMessage = error.message || 'Login failed. Please try again.';
        });
    }
  }
}
