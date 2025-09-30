import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPolicyService } from '../../core/services/userpolicy.service';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-policies.component.html',
  styleUrls: ['./my-policies.component.css']
})
export class MyPoliciesComponent implements OnInit {
  policies: any[] = [];
  constructor(private ups: UserPolicyService) {}
  ngOnInit() {
    this.ups.myPolicies().subscribe(res => this.policies = res || []);
  }
}
