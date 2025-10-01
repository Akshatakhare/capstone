import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClaimDto {
	_id: string;
	userId: string;
	userPolicyId: string;
	incidentDate: string;
	description: string;
	amountClaimed: number;
	status: 'PENDING' | 'APPROVED' | 'REJECTED';
	decisionNotes?: string;
	decidedByAgentId?: string;
	paymentRecorded?: boolean;
	createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ClaimsService {
	private readonly apiUrl = 'http://localhost:5000/api/v1/claims';
	constructor(private http: HttpClient) {}

	submitClaim(data: { 
		userPolicyId: string; 
		incidentDate: string; 
		description: string; 
		amountClaimed: number; 
	}) { 
		return this.http.post<ClaimDto>(this.apiUrl, data); 
	}
	
	getClaims(): Observable<ClaimDto[]> { 
		return this.http.get<ClaimDto[]>(this.apiUrl); 
	}
	
	getClaim(id: string): Observable<ClaimDto> { 
		return this.http.get<ClaimDto>(`${this.apiUrl}/${id}`); 
	}
	
	updateClaimStatus(id: string, status: string, notes?: string) { 
		return this.http.put(`${this.apiUrl}/${id}/status`, { status, notes }); 
	}
}


