import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserPolicyService } from '../../core/services/userpolicy.service';
import { ClaimsService } from '../../core/services/claims.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-submit-claim',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './submit-claim.component.html',
  styleUrls: ['./submit-claim.component.css']
})
export class SubmitClaimComponent implements OnInit {
  user: any = null;
  userPolicies: any[] = [];
  loading = false;
  submitting = false;
  
  claimData = {
    userPolicyId: '',
    incidentDate: '',
    description: '',
    amountClaimed: 0
  };

  constructor(
    private authService: AuthService,
    private userPolicyService: UserPolicyService,
    private claimsService: ClaimsService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadUserPolicies();
  }

  loadUserPolicies() {
    this.loading = true;
    this.userPolicyService.getUserPolicies().subscribe({
      next: (userPolicies) => {
        // Only show active policies WITH assigned agents
        this.userPolicies = userPolicies.filter(policy => 
          policy.status === 'ACTIVE' && policy.assignedAgentId
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user policies:', err);
        this.loading = false;
      }
    });
  }

  submitClaim() {
    if (!this.claimData.userPolicyId || !this.claimData.incidentDate || !this.claimData.description || !this.claimData.amountClaimed) {
      alert('Please fill in all required fields.');
      return;
    }

    this.submitting = true;
    this.claimsService.submitClaim(this.claimData).subscribe({
      next: (claim) => {
        console.log('Claim submitted successfully:', claim);
        this.submitting = false;
        alert('Claim submitted successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error submitting claim:', err);
        this.submitting = false;
        alert('Error submitting claim: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  resetForm() {
    this.claimData = {
      userPolicyId: '',
      incidentDate: '',
      description: '',
      amountClaimed: 0
    };
  }

  goBack() {
    window.history.back();
  }
}
