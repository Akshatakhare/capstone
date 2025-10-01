import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PaymentsService } from '../../core/services/payments.service';
import { UserPolicyService } from '../../core/services/userpolicy.service';
import { ClaimsService } from '../../core/services/claims.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-my-payments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.css']
})
export class MyPaymentsComponent implements OnInit {
  user: any = null;
  payments: any[] = [];
  userPolicies: any[] = [];
  approvedClaims: any[] = [];
  loading = false;
  showPaymentForm = false;
  selectedClaim: any = null;
  
  paymentData = {
    claimId: '',
    amount: 0,
    method: 'SIMULATED',
    reference: ''
  };

  constructor(
    private authService: AuthService,
    private paymentsService: PaymentsService,
    private userPolicyService: UserPolicyService,
    private claimsService: ClaimsService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadPayments();
    this.loadUserPolicies();
    this.loadApprovedClaims();
  }

  loadPayments() {
    this.loading = true;
    this.paymentsService.getUserPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.loading = false;
      }
    });
  }

  loadUserPolicies() {
    this.userPolicyService.getUserPolicies().subscribe({
      next: (userPolicies) => {
        this.userPolicies = userPolicies.filter(policy => policy.status === 'ACTIVE');
      },
      error: (err) => {
        console.error('Error loading user policies:', err);
      }
    });
  }

  loadApprovedClaims() {
    this.claimsService.getClaims().subscribe({
      next: (claims) => {
        // Only show approved claims that haven't been paid yet
        this.approvedClaims = claims.filter(claim => 
          claim.status === 'APPROVED' && !claim.paymentRecorded
        );
      },
      error: (err) => {
        console.error('Error loading approved claims:', err);
      }
    });
  }

  showPaymentModal(claim?: any) {
    this.selectedClaim = claim;
    this.paymentData = {
      claimId: claim ? claim._id : '',
      amount: claim ? claim.amountClaimed : 0,
      method: 'SIMULATED',
      reference: ''
    };
    this.showPaymentForm = true;
  }

  recordPayment() {
    if (!this.paymentData.amount || this.paymentData.amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    this.paymentsService.recordPayment(this.paymentData).subscribe({
      next: (payment) => {
        console.log('Payment recorded successfully:', payment);
        this.showPaymentForm = false;
        this.selectedClaim = null;
        this.loadPayments(); // Refresh payments
        this.loadApprovedClaims(); // Refresh approved claims
        alert('Payment recorded successfully!');
      },
      error: (err) => {
        console.error('Error recording payment:', err);
        alert('Error recording payment: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  cancelPayment() {
    this.showPaymentForm = false;
    this.selectedClaim = null;
  }

  getPaymentMethodLabel(method: string): string {
    const methods: { [key: string]: string } = {
      'CARD': 'Credit/Debit Card',
      'NETBANKING': 'Net Banking',
      'OFFLINE': 'Offline Payment',
      'SIMULATED': 'Simulated Payment'
    };
    return methods[method] || method;
  }

  goBack() {
    window.history.back();
  }
}
