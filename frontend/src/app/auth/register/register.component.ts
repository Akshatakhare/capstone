import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'customer';
  constructor(private auth: AuthService, private router: Router) {}
  register() {
    this.auth.register({ name: this.name, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: err => alert(err?.error?.message || 'Register failed')
      });
  }
}
