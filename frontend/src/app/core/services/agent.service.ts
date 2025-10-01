import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AgentStats {
  totalPolicies: number;
  activePolicies: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalRevenue: number;
}

export interface AssignedPolicy {
  _id: string;
  userId: any;
  policyProductId: any;
  startDate: string;
  endDate: string;
  premiumPaid: number;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  assignedAgentId: string;
  nominee?: {
    name: string;
    relation: string;
  };
  createdAt: string;
}

export interface AssignedClaim {
  _id: string;
  userId: any;
  userPolicyId: any;
  incidentDate: string;
  description: string;
  amountClaimed: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decisionNotes?: string;
  decidedByAgentId?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly apiUrl = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient) {}

  // Get agent's assigned policies
  getAssignedPolicies(): Observable<AssignedPolicy[]> {
    return this.http.get<AssignedPolicy[]>(`${this.apiUrl}/user/policies`);
  }

  // Get agent's assigned claims
  getAssignedClaims(): Observable<AssignedClaim[]> {
    return this.http.get<AssignedClaim[]>(`${this.apiUrl}/claims`);
  }

  // Update claim status (approve/reject)
  updateClaimStatus(claimId: string, status: 'APPROVED' | 'REJECTED', notes?: string): Observable<AssignedClaim> {
    return this.http.put<AssignedClaim>(`${this.apiUrl}/claims/${claimId}/status`, { status, notes });
  }

  // Get claim details
  getClaimDetails(claimId: string): Observable<AssignedClaim> {
    return this.http.get<AssignedClaim>(`${this.apiUrl}/claims/${claimId}`);
  }

  // Calculate agent statistics
  calculateStats(policies: AssignedPolicy[], claims: AssignedClaim[]): AgentStats {
    const activePolicies = policies.filter(p => p.status === 'ACTIVE').length;
    const pendingClaims = claims.filter(c => c.status === 'PENDING').length;
    const approvedClaims = claims.filter(c => c.status === 'APPROVED').length;
    const rejectedClaims = claims.filter(c => c.status === 'REJECTED').length;
    const totalRevenue = policies.reduce((sum, p) => sum + p.premiumPaid, 0);

    return {
      totalPolicies: policies.length,
      activePolicies,
      pendingClaims,
      approvedClaims,
      rejectedClaims,
      totalRevenue
    };
  }
}



