import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminService, AdminSummary } from '../../core/services/admin.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  user: any = null;
  summary: AdminSummary = {
    users: { total: 0, customers: 0, agents: 0, admins: 0 },
    policies: { total: 0, active: 0, assigned: 0, unassigned: 0 },
    claims: { total: 0, pending: 0, approved: 0, rejected: 0 },
    revenue: { total: 0, claims: 0, approvedClaims: 0, payments: 0 },
    payments: { total: 0, amount: 0 }
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Check if user is authenticated and is admin
    if (!this.user || !this.user._id || this.user.role !== 'admin') {
      console.error('User not authenticated or not admin');
      this.authService.logout();
      return;
    }
    
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load summary data
    this.adminService.getSummary().subscribe({
      next: (summary) => {
        console.log('Admin summary loaded:', summary);
        this.summary = summary;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading admin summary:', err);
        if (err.status === 401) {
          console.error('Unauthorized - redirecting to login');
          this.authService.logout();
        } else if (err.status === 403) {
          console.error('Forbidden - user is not admin');
          this.authService.logout();
        }
        this.loading = false;
      }
    });
  }


  logout() {
    this.authService.logout();
  }

  goBack() {
    window.history.back();
  }
}