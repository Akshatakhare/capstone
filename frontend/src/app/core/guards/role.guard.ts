import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data?.['roles'] as string[];
  const role = auth.role;

  if (!role || !expectedRoles.includes(role)) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
