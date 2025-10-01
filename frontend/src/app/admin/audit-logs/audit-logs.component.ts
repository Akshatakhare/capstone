import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminService, AuditLog } from '../../core/services/admin.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent implements OnInit {
  user: any = null;
  auditLogs: AuditLog[] = [];
  loading = false;
  limit = 50;

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadAuditLogs();
  }

  loadAuditLogs() {
    this.loading = true;
    this.adminService.getAuditLogs(this.limit).subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading audit logs:', err);
        this.loading = false;
      }
    });
  }

  getActionIcon(action: string): string {
    if (action.includes('create')) return '➕';
    if (action.includes('update')) return '✏️';
    if (action.includes('delete')) return '🗑️';
    if (action.includes('login')) return '🔐';
    if (action.includes('logout')) return '🚪';
    if (action.includes('assign')) return '👤';
    if (action.includes('purchase')) return '💳';
    if (action.includes('claim')) return '📄';
    if (action.includes('payment')) return '💰';
    return '📋';
  }

  getActionColor(action: string): string {
    if (action.includes('create')) return '#10b981';
    if (action.includes('update')) return '#3b82f6';
    if (action.includes('delete')) return '#ef4444';
    if (action.includes('login')) return '#8b5cf6';
    if (action.includes('logout')) return '#6b7280';
    if (action.includes('assign')) return '#f59e0b';
    if (action.includes('purchase')) return '#10b981';
    if (action.includes('claim')) return '#3b82f6';
    if (action.includes('payment')) return '#10b981';
    return '#6b7280';
  }

  formatAction(action: string): string {
    return action.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  goBack() {
    window.history.back();
  }
}



