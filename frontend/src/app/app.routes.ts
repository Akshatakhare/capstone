import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { CustomerDashboardComponent } from './customer/dashboard/customer-dashboard.component';
import { MyPoliciesComponent } from './customer/my-policies/my-policies.component';
import { SubmitClaimComponent } from './customer/submit-claim/submit-claim.component';
import { MyPaymentsComponent } from './customer/my-payments/my-payments.component';
import { AgentDashboardComponent } from './agent/dashboard/agent-dashboard.component';
import { AssignedClaimsComponent } from './agent/assigned-claims/assigned-claims.component';
import { AssignedPoliciesComponent } from './agent/assigned-policies/assigned-policies.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { ManagePoliciesComponent } from './admin/manage-policies/manage-policies.component';
import { ManageAgentsComponent } from './admin/manage-agents/manage-agents.component';
import { ManageAssignmentsComponent } from './admin/manage-assignments/manage-assignments.component';
import { AuditLogsComponent } from './admin/audit-logs/audit-logs.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Customer routes
  { 
    path: 'customer/dashboard', 
    component: CustomerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['customer'] }
  },
  { 
    path: 'customer/my-policies', 
    component: MyPoliciesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['customer'] }
  },
  { 
    path: 'customer/submit-claim', 
    component: SubmitClaimComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['customer'] }
  },
  { 
    path: 'customer/my-payments', 
    component: MyPaymentsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['customer'] }
  },
  
  // Agent routes
  { 
    path: 'agent/dashboard', 
    component: AgentDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['agent'] }
  },
  { 
    path: 'agent/assigned-claims', 
    component: AssignedClaimsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['agent'] }
  },
  { 
    path: 'agent/assigned-policies', 
    component: AssignedPoliciesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['agent'] }
  },
  
  // Admin routes
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/manage-policies', 
    component: ManagePoliciesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/manage-agents', 
    component: ManageAgentsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/manage-assignments', 
    component: ManageAssignmentsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/audit-logs', 
    component: AuditLogsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  
  // Wildcard route
  { path: '**', redirectTo: '' },
];
