import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AdminService, Agent, UserPolicy, Claim } from '../../core/services/admin.service';

@Component({
  selector: 'app-manage-assignments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manage-assignments.component.html',
  styleUrls: ['./manage-assignments.component.css']
})
export class ManageAssignmentsComponent implements OnInit {
  user: any = null;
  agents: Agent[] = [];
  userPolicies: UserPolicy[] = [];
  loading = false;
  assigning = false;
  showAssignmentModal = false;
  selectedEntity: any = null;
  selectedEntityType: 'policy' = 'policy';
  
  assignmentData = {
    entity: 'policy' as 'policy',
    entityId: '',
    agentId: ''
  };

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    Promise.all([
      this.adminService.getAgents().toPromise(),
      this.adminService.getUserPolicies().toPromise()
    ]).then(([agents, userPolicies]) => {
      this.agents = agents || [];
      this.userPolicies = userPolicies || [];
      
      // Debug logging
      console.log('Loaded data for admin assignments:');
      console.log('Agents:', this.agents.length);
      console.log('User Policies (purchased policies):', this.userPolicies.length);
      console.log('User Policies data:', this.userPolicies);
      
      this.loading = false;
    }).catch((err) => {
      console.error('Error loading data:', err);
      this.loading = false;
    });
  }

  showAssignmentModalForEntity(entity: any, type: 'policy') {
    this.selectedEntity = entity;
    this.selectedEntityType = type;
    this.assignmentData = {
      entity: type,
      entityId: entity._id,
      agentId: ''
    };
    this.showAssignmentModal = true;
  }

  assignAgent() {
    if (!this.assignmentData.agentId) {
      alert('Please select an agent.');
      return;
    }

    this.assigning = true;
    this.adminService.assignAgent(this.assignmentData).subscribe({
      next: (result) => {
        console.log('Agent assigned successfully:', result);
        this.showAssignmentModal = false;
        this.selectedEntity = null;
        this.assigning = false;
        this.loadData(); // Refresh data
        alert('Agent assigned successfully!');
      },
      error: (err) => {
        console.error('Error assigning agent:', err);
        this.assigning = false;
        alert('Error assigning agent: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  closeModal() {
    this.showAssignmentModal = false;
    this.selectedEntity = null;
  }

  getUnassignedPolicies(): UserPolicy[] {
    // Only show purchased policies that don't have an assigned agent
    return this.userPolicies.filter(policy => !policy.assignedAgentId);
  }

  getAssignedPolicies(): UserPolicy[] {
    // Only show purchased policies that have an assigned agent
    return this.userPolicies.filter(policy => policy.assignedAgentId);
  }

  getAgentName(agentId: string | undefined): string {
    if (!agentId) return 'Unassigned';
    const agent = this.agents.find(a => a._id === agentId);
    return agent ? agent.name : 'Unknown Agent';
  }

  getTotalPurchasedPolicies(): number {
    return this.userPolicies.length;
  }

  getTotalUnassignedPolicies(): number {
    return this.getUnassignedPolicies().length;
  }

  getTotalAssignedPolicies(): number {
    return this.getAssignedPolicies().length;
  }

  goBack() {
    window.history.back();
  }
}
