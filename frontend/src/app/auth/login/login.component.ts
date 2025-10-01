// import { Component } from '@angular/core';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   template: `
//     <h2>Login</h2>
//     <form (ngSubmit)="login()">
//       <input [(ngModel)]="email" name="email" placeholder="Email" />
//       <input [(ngModel)]="password" name="password" type="password" placeholder="Password" />
//       <button type="submit">Login</button>
//     </form>
//   `
// })
// export class LoginComponent {
//   email = '';
//   password = '';
//   constructor(private auth: AuthService) {}
//   login() {
//     this.auth.login({ email: this.email, password: this.password }).subscribe();
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  
  constructor(private auth: AuthService, private router: Router) {}
  
  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }
    
    this.loading = true;
    this.errorMsg = '';
    
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful:', response);
        // Redirect based on user role
        const user = response.user;
        const role = user?.role;
        
        console.log('User role:', role);
        
        switch(role) {
          case 'customer':
            this.router.navigate(['/customer/dashboard']);
            break;
          case 'agent':
            this.router.navigate(['/home']);
            break;
          case 'admin':
            this.router.navigate(['/admin/dashboard']);
            break;
          default:
            console.log('Unknown role, redirecting to customer dashboard');
            this.router.navigate(['/customer/dashboard']);
        }
      },
      error: err => {
        this.loading = false;
        console.error('Login error:', err);
        this.errorMsg = err?.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
