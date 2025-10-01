import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PoliciesService } from '../../core/services/policies.service';
import { UserPolicyService } from '../../core/services/userpolicy.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './my-policies.component.html',
  styleUrls: ['./my-policies.component.css']
})
export class MyPoliciesComponent implements OnInit {
  user: any = null;
  policies: any[] = [];
  userPolicies: any[] = [];
  loading = false;
  showPurchaseForm = false;
  selectedPolicy: any = null;
  purchaseData = {
    startDate: '',
    termMonths: 12,
    nominee: {
      name: '',
      relation: ''
    }
  };

  constructor(
    private authService: AuthService,
    private policiesService: PoliciesService,
    private userPolicyService: UserPolicyService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadPolicies();
    this.loadUserPolicies();
  }

  loadPolicies() {
    this.loading = true;
    this.policiesService.getPolicies().subscribe({
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

  loadUserPolicies() {
    this.userPolicyService.getUserPolicies().subscribe({
      next: (userPolicies) => {
        this.userPolicies = userPolicies;
      },
      error: (err) => {
        console.error('Error loading user policies:', err);
      }
    });
  }

  showPurchaseModal(policy: any) {
    this.selectedPolicy = policy;
    this.purchaseData = {
      startDate: new Date().toISOString().split('T')[0],
      termMonths: policy.termMonths || 12,
      nominee: {
        name: '',
        relation: ''
      }
    };
    this.showPurchaseForm = true;
  }

  purchasePolicy() {
    if (!this.selectedPolicy) return;
    
    this.userPolicyService.purchasePolicy(this.selectedPolicy._id, this.purchaseData).subscribe({
      next: (userPolicy) => {
        console.log('Policy purchased successfully:', userPolicy);
        this.showPurchaseForm = false;
        this.selectedPolicy = null;
        this.loadUserPolicies(); // Refresh user policies
        
        // Show success message with agent assignment info
        const message = `🎉 Policy purchased successfully!\n\n` +
          `📋 Policy: ${this.selectedPolicy.title}\n` +
          `💰 Premium: $${this.selectedPolicy.premium}/month\n\n` +
          `👤 An agent will be assigned to your policy within 24 hours.\n` +
          `📞 You will receive a call from your assigned agent to complete the setup process.\n\n` +
          `✅ You can view your policy status in "My Policies" section.`;
        
        alert(message);
      },
      error: (err) => {
        console.error('Error purchasing policy:', err);
        alert('Error purchasing policy: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  cancelPurchase() {
    this.showPurchaseForm = false;
    this.selectedPolicy = null;
  }

  cancelPolicy(userPolicy: any) {
    if (confirm('Are you sure you want to cancel this policy?')) {
      this.userPolicyService.cancelPolicy(userPolicy._id).subscribe({
        next: (result) => {
          console.log('Policy cancelled successfully:', result);
          this.loadUserPolicies(); // Refresh user policies
          alert('Policy cancelled successfully!');
        },
        error: (err) => {
          console.error('Error cancelling policy:', err);
          alert('Error cancelling policy: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  goBack() {
    window.history.back();
  }
}
