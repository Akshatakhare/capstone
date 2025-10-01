import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AdminService, Policy } from '../../core/services/admin.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-manage-policies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './manage-policies.component.html',
  styleUrls: ['./manage-policies.component.css']
})
export class ManagePoliciesComponent implements OnInit {
  user: any = null;
  policies: Policy[] = [];
  loading = false;
  creating = false;
  showCreateForm = false;
  showEditForm = false;
  selectedPolicy: Policy | null = null;
  
  newPolicy = {
    code: '',
    title: '',
    description: '',
    premium: 0,
    termMonths: 12,
    minSumInsured: 0
  };

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadPolicies();
  }

  loadPolicies() {
    this.loading = true;
    this.adminService.getPolicies().subscribe({
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

  showCreateModal() {
    this.newPolicy = {
      code: '',
      title: '',
      description: '',
      premium: 0,
      termMonths: 12,
      minSumInsured: 0
    };
    this.showCreateForm = true;
  }

  showEditModal(policy: Policy) {
    this.selectedPolicy = policy;
    this.newPolicy = {
      code: policy.code,
      title: policy.title,
      description: policy.description,
      premium: policy.premium,
      termMonths: policy.termMonths,
      minSumInsured: policy.minSumInsured
    };
    this.showEditForm = true;
  }

  createPolicy() {
    if (!this.newPolicy.code || !this.newPolicy.title || !this.newPolicy.premium) {
      alert('Please fill in all required fields.');
      return;
    }

    this.creating = true;
    this.adminService.createPolicy(this.newPolicy).subscribe({
      next: (policy) => {
        console.log('Policy created successfully:', policy);
        this.showCreateForm = false;
        this.creating = false;
        this.loadPolicies(); // Refresh policies
        alert('Policy created successfully!');
      },
      error: (err) => {
        console.error('Error creating policy:', err);
        this.creating = false;
        alert('Error creating policy: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  updatePolicy() {
    if (!this.selectedPolicy || !this.newPolicy.code || !this.newPolicy.title || !this.newPolicy.premium) {
      alert('Please fill in all required fields.');
      return;
    }

    this.creating = true;
    this.adminService.updatePolicy(this.selectedPolicy._id, this.newPolicy).subscribe({
      next: (policy) => {
        console.log('Policy updated successfully:', policy);
        this.showEditForm = false;
        this.selectedPolicy = null;
        this.creating = false;
        this.loadPolicies(); // Refresh policies
        alert('Policy updated successfully!');
      },
      error: (err) => {
        console.error('Error updating policy:', err);
        this.creating = false;
        alert('Error updating policy: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  deletePolicy(policy: Policy) {
    if (confirm(`Are you sure you want to delete policy "${policy.title}"?`)) {
      this.adminService.deletePolicy(policy._id).subscribe({
        next: (result) => {
          console.log('Policy deleted successfully:', result);
          this.loadPolicies(); // Refresh policies
          alert('Policy deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting policy:', err);
          alert('Error deleting policy: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  closeModal() {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.selectedPolicy = null;
  }

  goBack() {
    window.history.back();
  }
}