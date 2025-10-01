import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AdminService, Agent } from '../../core/services/admin.service';

@Component({
  selector: 'app-manage-agents',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manage-agents.component.html',
  styleUrls: ['./manage-agents.component.css']
})
export class ManageAgentsComponent implements OnInit {
  user: any = null;
  agents: Agent[] = [];
  loading = false;
  creating = false;
  showCreateForm = false;
  
  newAgent = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadAgents();
  }

  loadAgents() {
    this.loading = true;
    this.adminService.getAgents().subscribe({
      next: (agents) => {
        this.agents = agents;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading agents:', err);
        this.loading = false;
      }
    });
  }

  showCreateModal() {
    this.newAgent = {
      name: '',
      email: '',
      password: ''
    };
    this.showCreateForm = true;
  }

  createAgent() {
    if (!this.newAgent.name || !this.newAgent.email || !this.newAgent.password) {
      alert('Please fill in all required fields.');
      return;
    }

    this.creating = true;
    this.adminService.createAgent(this.newAgent).subscribe({
      next: (result) => {
        console.log('Agent created successfully:', result);
        this.showCreateForm = false;
        this.creating = false;
        this.loadAgents(); // Refresh agents
        alert('Agent created successfully!');
      },
      error: (err) => {
        console.error('Error creating agent:', err);
        this.creating = false;
        alert('Error creating agent: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  deleteAgent(agent: Agent) {
    if (confirm(`Are you sure you want to delete agent "${agent.name}"? This action cannot be undone.`)) {
      // Note: You'll need to add a deleteAgent method to the admin service
      // For now, we'll show a message that this feature needs backend implementation
      alert('Delete agent functionality needs to be implemented in the backend. Please contact the developer.');
    }
  }

  closeModal() {
    this.showCreateForm = false;
  }

  goBack() {
    window.history.back();
  }
}
