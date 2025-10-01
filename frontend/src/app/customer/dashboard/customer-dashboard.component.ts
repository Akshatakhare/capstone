import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserPolicyService } from '../../core/services/userpolicy.service';
import { ClaimsService } from '../../core/services/claims.service';
import { PaymentsService } from '../../core/services/payments.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  user: any = null;
  stats = {
    activePolicies: 0,
    pendingPolicies: 0,
    totalPayments: 0,
    totalAmount: 0,
    claims: 0,
    pendingClaims: 0,
    approvedClaims: 0
  };
  recentActivity: any[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private userPolicyService: UserPolicyService,
    private claimsService: ClaimsService,
    private paymentsService: PaymentsService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load user policies
    this.userPolicyService.getUserPolicies().subscribe({
      next: (policies) => {
        this.stats.activePolicies = policies.filter(p => p.status === 'ACTIVE').length;
        this.stats.pendingPolicies = policies.filter(p => p.status === 'PENDING' || !p.assignedAgentId).length;
        this.stats.totalAmount = policies.reduce((sum, policy) => sum + (policy.premiumPaid || 0), 0);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading policies:', err);
        this.loading = false;
      }
    });

    // Load claims
    this.claimsService.getClaims().subscribe({
      next: (claims) => {
        this.stats.claims = claims.length;
        this.stats.pendingClaims = claims.filter(c => c.status === 'PENDING').length;
        this.stats.approvedClaims = claims.filter(c => c.status === 'APPROVED' && !c.paymentRecorded).length;
      },
      error: (err) => {
        console.error('Error loading claims:', err);
      }
    });

    // Load payments
    this.paymentsService.getUserPayments().subscribe({
      next: (payments) => {
        this.stats.totalPayments = payments.length;
        this.generateRecentActivity(payments);
      },
      error: (err) => {
        console.error('Error loading payments:', err);
      }
    });
  }

  generateRecentActivity(payments: any[]) {
    this.recentActivity = [];
    
    // Add recent payments
    const recentPayments = payments.slice(0, 3).map(payment => ({
      icon: '💰',
      title: 'Payment Recorded',
      description: `Payment of $${payment.amount} via ${payment.method}`,
      date: new Date(payment.createdAt).toLocaleDateString()
    }));

    this.recentActivity = [...recentPayments];
    
    // Add default activities if no recent activity
    if (this.recentActivity.length === 0) {
      this.recentActivity = [
        {
          icon: '📋',
          title: 'Welcome to Your Dashboard',
          description: 'Start by browsing and purchasing policies',
          date: 'Today'
        },
        {
          icon: '💰',
          title: 'Make Your First Payment',
          description: 'Record payments for your policies',
          date: 'Today'
        },
        {
          icon: '📄',
          title: 'Submit Claims',
          description: 'Submit claims for covered incidents',
          date: 'Today'
        }
      ];
    }
  }

  logout() {
    this.authService.logout();
  }

  goBack() {
    window.history.back();
  }
}


