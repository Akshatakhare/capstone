import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentDto {
	_id: string;
	userId: string;
	userPolicyId?: string;
	claimId?: string;
	amount: number;
	method: 'CARD' | 'NETBANKING' | 'OFFLINE' | 'SIMULATED';
	reference?: string;
	createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentsService {
	private readonly apiUrl = 'http://localhost:5000/api/v1/payments';
	constructor(private http: HttpClient) {}

	getUserPayments(): Observable<PaymentDto[]> { 
		return this.http.get<PaymentDto[]>(`${this.apiUrl}/user`); 
	}
	
	recordPayment(data: { 
		policyId?: string; 
		claimId?: string;
		amount: number; 
		method?: string; 
		reference?: string; 
	}) { 
		return this.http.post<PaymentDto>(this.apiUrl, data); 
	}
}


