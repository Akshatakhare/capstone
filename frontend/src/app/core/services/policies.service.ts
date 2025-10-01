import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PolicyDto {
	_id: string;
	code: string;
	title: string;
	description: string;
	premium: number;
	termMonths: number;
	minSumInsured: number;
}

@Injectable({ providedIn: 'root' })
export class PoliciesService {
    private readonly apiUrl = 'http://localhost:5000/api/v1/policies';
	constructor(private http: HttpClient) {}

	getPolicies(): Observable<PolicyDto[]> { 
		return this.http.get<PolicyDto[]>(this.apiUrl); 
	}
	
	getPolicy(id: string): Observable<PolicyDto> { 
		return this.http.get<PolicyDto>(`${this.apiUrl}/${id}`); 
	}
	
	createPolicy(data: Partial<PolicyDto>) { 
		return this.http.post<PolicyDto>(this.apiUrl, data); 
	}
	
	updatePolicy(id: string, data: Partial<PolicyDto>) { 
		return this.http.put<PolicyDto>(`${this.apiUrl}/${id}`, data); 
	}
	
	deletePolicy(id: string) { 
		return this.http.delete(`${this.apiUrl}/${id}`); 
	}
}


