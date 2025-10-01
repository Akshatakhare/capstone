import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserPolicyDto {
	_id: string;
	userId: string;
	policyProductId: any;
	startDate: string;
	endDate: string;
	premiumPaid: number;
	status: string;
	assignedAgentId?: string;
	nominee?: {
		name: string;
		relation: string;
	};
}

@Injectable({ providedIn: 'root' })
export class UserPolicyService {
    private readonly apiUrl = 'http://localhost:5000/api/v1/user/policies';

	constructor(private http: HttpClient) {}

	getUserPolicies(): Observable<UserPolicyDto[]> {
		return this.http.get<UserPolicyDto[]>(`${this.apiUrl}`);
	}
	
	purchasePolicy(policyId: string, purchaseData: any) { 
		return this.http.post<UserPolicyDto>(`${this.apiUrl}/${policyId}/purchase`, purchaseData); 
	}
	
	cancelPolicy(policyId: string) { 
		return this.http.put(`${this.apiUrl}/${policyId}/cancel`, {}); 
	}
}


