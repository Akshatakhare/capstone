import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AgentService, AssignedPolicy } from '../../core/services/agent.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-assigned-policies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './assigned-policies.component.html',
  styleUrls: ['./assigned-policies.component.css']
})
export class AssignedPoliciesComponent implements OnInit {
  user: any = null;
  policies: AssignedPolicy[] = [];
  loading = false;
  showPolicyModal = false;
  selectedPolicy: AssignedPolicy | null = null;

  // Filter options
  statusFilter = 'ALL';
  statusOptions = [
    { value: 'ALL', label: 'All Policies' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'EXPIRED', label: 'Expired' }
  ];

  constructor(
    private authService: AuthService,
    private agentService: AgentService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadPolicies();
  }

  loadPolicies() {
    this.loading = true;
    this.agentService.getAssignedPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading policies:', err);
        this.loading = false;
      }
    });
  }

  showPolicyDetails(policy: AssignedPolicy) {
    this.selectedPolicy = policy;
    this.showPolicyModal = true;
  }

  closeModal() {
    this.showPolicyModal = false;
    this.selectedPolicy = null;
  }

  getFilteredPolicies(): AssignedPolicy[] {
    if (this.statusFilter === 'ALL') {
      return this.policies;
    }
    return this.policies.filter(policy => policy.status === this.statusFilter);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      case 'EXPIRED': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACTIVE': return '✅';
      case 'CANCELLED': return '❌';
      case 'EXPIRED': return '⏰';
      default: return '📄';
    }
  }

  getPolicyStats() {
    const total = this.policies.length;
    const active = this.policies.filter(p => p.status === 'ACTIVE').length;
    const cancelled = this.policies.filter(p => p.status === 'CANCELLED').length;
    const expired = this.policies.filter(p => p.status === 'EXPIRED').length;
    const totalRevenue = this.policies.reduce((sum, p) => sum + p.premiumPaid, 0);

    return { total, active, cancelled, expired, totalRevenue };
  }

  goBack() {
    window.history.back();
  }
}
