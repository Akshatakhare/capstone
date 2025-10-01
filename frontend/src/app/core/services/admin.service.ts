import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminSummary {
  users: {
    total: number;
    customers: number;
    agents: number;
    admins: number;
  };
  policies: {
    total: number;
    active: number;
    assigned: number;
    unassigned: number;
  };
  claims: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  revenue: {
    total: number;
    claims: number;
    approvedClaims: number;
    payments: number;
  };
  payments: {
    total: number;
    amount: number;
  };
}

export interface AuditLog {
  _id: string;
  action: string;
  actorId: string;
  details: any;
  ip?: string;
  timestamp: string;
}

export interface Agent {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Policy {
  _id: string;
  code: string;
  title: string;
  description: string;
  premium: number;
  termMonths: number;
  minSumInsured: number;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UserPolicy {
  _id: string;
  userId: any;
  policyProductId: any;
  startDate: string;
  endDate: string;
  premiumPaid: number;
  status: string;
  assignedAgentId?: string;
  createdAt: string;
}

export interface Claim {
  _id: string;
  userId: any;
  userPolicyId: any;
  incidentDate: string;
  description: string;
  amountClaimed: number;
  status: string;
  decidedByAgentId?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient) {}

  // Dashboard Summary
  getSummary(): Observable<AdminSummary> {
    return this.http.get<AdminSummary>(`${this.apiUrl}/admin/summary`);
  }

  // Audit Logs
  getAuditLogs(limit: number = 20): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/admin/audit?limit=${limit}`);
  }

  // Agent Management
  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/admin/agents`);
  }

  createAgent(agentData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/agents`, agentData);
  }

  assignAgent(assignmentData: { entity: 'policy' | 'claim'; entityId: string; agentId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/assign-agent`, assignmentData);
  }

  // Policy Management
  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/policies`);
  }

  createPolicy(policyData: { code: string; title: string; description: string; premium: number; termMonths: number; minSumInsured: number }): Observable<Policy> {
    return this.http.post<Policy>(`${this.apiUrl}/policies`, policyData);
  }

  updatePolicy(policyId: string, policyData: Partial<Policy>): Observable<Policy> {
    return this.http.put<Policy>(`${this.apiUrl}/policies/${policyId}`, policyData);
  }

  deletePolicy(policyId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/policies/${policyId}`);
  }

  // User Management
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // User Policies
  getUserPolicies(): Observable<UserPolicy[]> {
    return this.http.get<UserPolicy[]>(`${this.apiUrl}/admin/user-policies`);
  }

  // Claims
  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/claims`);
  }

  // Calculate additional statistics
  calculateDetailedStats(users: User[], policies: Policy[], userPolicies: UserPolicy[], claims: Claim[]): any {
    const customers = users.filter(u => u.role === 'customer').length;
    const agents = users.filter(u => u.role === 'agent').length;
    const admins = users.filter(u => u.role === 'admin').length;
    
    const activePolicies = userPolicies.filter(p => p.status === 'ACTIVE').length;
    const cancelledPolicies = userPolicies.filter(p => p.status === 'CANCELLED').length;
    const expiredPolicies = userPolicies.filter(p => p.status === 'EXPIRED').length;
    
    const approvedClaims = claims.filter(c => c.status === 'APPROVED').length;
    const rejectedClaims = claims.filter(c => c.status === 'REJECTED').length;
    const pendingClaims = claims.filter(c => c.status === 'PENDING').length;
    
    const totalRevenue = userPolicies.reduce((sum, p) => sum + p.premiumPaid, 0);
    const totalClaimAmount = claims.reduce((sum, c) => sum + c.amountClaimed, 0);
    const approvedClaimAmount = claims.filter(c => c.status === 'APPROVED').reduce((sum, c) => sum + c.amountClaimed, 0);

    return {
      users: { total: users.length, customers, agents, admins },
      policies: { total: policies.length, active: activePolicies, cancelled: cancelledPolicies, expired: expiredPolicies },
      claims: { total: claims.length, approved: approvedClaims, rejected: rejectedClaims, pending: pendingClaims },
      revenue: { total: totalRevenue, claims: totalClaimAmount, approvedClaims: approvedClaimAmount }
    };
  }
}
