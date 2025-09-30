import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy-detail.component.html',
  styleUrls: ['./policy-detail.component.css']
})
export class PolicyDetailComponent implements OnInit {
  policy: any;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`/api/v1/policies/${id}`).subscribe(res => this.policy = res);
  }
  buyPolicy() {
    alert('Login/Register to purchase policies.');
  }
}
