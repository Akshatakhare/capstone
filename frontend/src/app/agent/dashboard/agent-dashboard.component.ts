import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { AgentService, AgentStats } from '../../core/services/agent.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit {
  user: any = null;
  stats: AgentStats = {
    totalPolicies: 0,
    activePolicies: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    totalRevenue: 0
  };
  recentActivity: any[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private agentService: AgentService,
    private location: Location
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;

    console.log('Agent Dashboard - User:', this.user);
    console.log('Agent Dashboard - User role:', this.user?.role);

    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    console.log('Loading dashboard data...');

    forkJoin({
      policies: this.agentService.getAssignedPolicies(),
      claims: this.agentService.getAssignedClaims()
    }).subscribe({
      next: ({ policies, claims }) => {
        console.log('Policies loaded:', policies);
        console.log('Claims loaded:', claims);

        this.stats = this.agentService.calculateStats(policies || [], claims || []);
        console.log('Stats calculated:', this.stats);

        this.generateRecentActivity(claims || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }

  generateRecentActivity(claims: any[]) {
    this.recentActivity = [];

    if (claims.length > 0) {
      const recentClaims = claims
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(claim => ({
          icon: this.getClaimIcon(claim.status),
          title: `Claim #${claim._id?.slice(-6)}`,
          description: `${claim.userId?.name || 'Customer'} - $${claim.amountClaimed} (${claim.status})`,
          date: new Date(claim.createdAt).toLocaleDateString()
        }));

      this.recentActivity = [...recentClaims];
    }

    if (this.recentActivity.length === 0) {
      this.recentActivity = [
        {
          icon: '📋',
          title: 'Welcome to Your Agent Dashboard',
          description: 'Start by reviewing assigned policies and claims',
          date: 'Today'
        },
        {
          icon: '💰',
          title: 'No Claims Assigned',
          description: 'You will see assigned claims here for review',
          date: 'Today'
        }
      ];
    }
  }

  getClaimIcon(status: string): string {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      default: return '📄';
    }
  }

  logout() {
    console.log('Logout button clicked');
    this.authService.logout();
  }

  goBack() {
    this.location.back();
  }
}
