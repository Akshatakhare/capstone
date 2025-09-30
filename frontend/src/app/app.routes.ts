import { Routes } from '@angular/router';

// Public
import { HomeComponent } from './public/home/home.component';
import { PolicyDetailComponent } from './public/policy-detail/policy-detail.component';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Customer
import { DashboardComponent as CustomerDashboard } from './customer/dashboard/dashboard.component';
import { MyPoliciesComponent } from './customer/my-policies/my-policies.component';
import { SubmitClaimComponent } from './customer/submit-claim/submit-claim.component';
import { MyPaymentsComponent } from './customer/my-payments/my-payments.component';

// Agent
import { DashboardComponent as AgentDashboard } from './agent/dashboard/dashboard.component';
import { AssignedClaimsComponent } from './agent/assigned-claims/assigned-claims.component';

// Admin
import { DashboardComponent as AdminDashboard } from './admin/dashboard/dashboard.component';
import { ManagePoliciesComponent } from './admin/manage-policies/manage-policies.component';
import { ManageAgentsComponent } from './admin/manage-agents/manage-agents.component';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'policy/:id', component: PolicyDetailComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard/customer',
    component: CustomerDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['customer'] },
    children: [
      { path: 'policies', component: MyPoliciesComponent },
      { path: 'claims', component: SubmitClaimComponent },
      { path: 'payments', component: MyPaymentsComponent },
    ],
  },

  {
    path: 'dashboard/agent',
    component: AgentDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['agent'] },
    children: [
      { path: 'assigned-claims', component: AssignedClaimsComponent },
    ],
  },

  {
    path: 'dashboard/admin',
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'manage-policies', component: ManagePoliciesComponent },
      { path: 'manage-agents', component: ManageAgentsComponent },
    ],
  },

  { path: '**', redirectTo: '' },
];
