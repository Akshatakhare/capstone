import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AgentService, AssignedClaim } from '../../core/services/agent.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-assigned-claims',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './assigned-claims.component.html',
  styleUrls: ['./assigned-claims.component.css']
})
export class AssignedClaimsComponent implements OnInit {
  user: any = null;
  claims: AssignedClaim[] = [];
  loading = false;
  showClaimModal = false;
  selectedClaim: AssignedClaim | null = null;
  decisionNotes = '';

  constructor(
    private authService: AuthService,
    private agentService: AgentService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadClaims();
   
  }

  loadClaims() {
    this.loading = true;
    this.agentService.getAssignedClaims().subscribe({
      next: (claims) => {
        this.claims = claims;
        this.loading = false;
        console.log("Claims:",this.claims)
      },
      error: (err) => {
        console.error('Error loading claims:', err);
        this.loading = false;
      }
    });
  }

  showClaimDetails(claim: AssignedClaim) {
    this.selectedClaim = claim;
    this.decisionNotes = claim.decisionNotes || '';
    this.showClaimModal = true;
  }

  approveClaim() {
    if (!this.selectedClaim) return;
    
    this.agentService.updateClaimStatus(this.selectedClaim._id, 'APPROVED', this.decisionNotes).subscribe({
      next: (updatedClaim) => {
        console.log('Claim approved:', updatedClaim);
        this.showClaimModal = false;
        this.selectedClaim = null;
        this.decisionNotes = '';
        this.loadClaims(); // Refresh claims
        alert('Claim approved successfully!');
      },
      error: (err) => {
        console.error('Error approving claim:', err);
        alert('Error approving claim: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  rejectClaim() {
    if (!this.selectedClaim) return;
    
    this.agentService.updateClaimStatus(this.selectedClaim._id, 'REJECTED', this.decisionNotes).subscribe({
      next: (updatedClaim) => {
        console.log('Claim rejected:', updatedClaim);
        this.showClaimModal = false;
        this.selectedClaim = null;
        this.decisionNotes = '';
        this.loadClaims(); // Refresh claims
        alert('Claim rejected successfully!');
      },
      error: (err) => {
        console.error('Error rejecting claim:', err);
        alert('Error rejecting claim: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  closeModal() {
    this.showClaimModal = false;
    this.selectedClaim = null;
    this.decisionNotes = '';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'APPROVED': return '#10b981';
      case 'REJECTED': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      default: return '📄';
    }
  }

  goBack() {
    window.history.back();
  }
}


