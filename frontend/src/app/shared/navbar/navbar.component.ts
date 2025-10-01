import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any = null;
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
    
    // Also check localStorage in case the observable hasn't fired yet
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  getDashboardRoute(): string {
    if (!this.user) return '/login';
    
    switch (this.user.role) {
      case 'admin': return '/admin/dashboard';
      case 'agent': return '/agent/dashboard';
      case 'customer': return '/customer/dashboard';
      default: return '/login';
    }
  }

  getDashboardName(): string {
    if (!this.user) return 'Dashboard';
    
    switch (this.user.role) {
      case 'admin': return 'Admin Dashboard';
      case 'agent': return 'Agent Dashboard';
      case 'customer': return 'Customer Dashboard';
      default: return 'Dashboard';
    }
  }
}
