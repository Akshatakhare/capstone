import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'customer';
  loading = false;
  errorMsg = '';
  constructor(private auth: AuthService, private router: Router) {}
  register() {
    if (!this.name || !this.email || !this.password) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.auth.register({ name: this.name, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: err => {
          this.loading = false;
          const status = err?.status;
          const msg = err?.error?.message;
          this.errorMsg = status === 409
            ? 'Email already registered. Please log in instead.'
            : (msg || 'Registration failed. Please try again.');
        }
      });
  }
}
