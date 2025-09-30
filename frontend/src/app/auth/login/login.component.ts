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
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  constructor(private auth: AuthService, private router: Router) {}
  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const role = this.auth.role;
        if (role === 'admin') this.router.navigate(['/dashboard/admin']);
        else if (role === 'agent') this.router.navigate(['/dashboard/agent']);
        else this.router.navigate(['/dashboard/customer']);
      },
      error: err => alert(err?.error?.message || 'Login failed')
    });
  }
}
