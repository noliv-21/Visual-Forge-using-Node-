import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated()){
    return true;
  }else{
    router.navigate(['/auth/login']);
    return false;
  }
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated() && authService.hasRole('admin')){
    return true;
  }else{
    router.navigate(['/auth/admin/login']);
    return false;
  }
}

export const editorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated() && authService.hasRole('Editor')){
    return true;
  } else {
    if (authService.isAuthenticated()) {
      router.navigate(['/user']);
    } else {
      router.navigate(['/auth/login']);
    }
    return false;
  }
}
