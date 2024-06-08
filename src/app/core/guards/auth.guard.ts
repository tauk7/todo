import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

function canNavigate() {
  const user = localStorage.getItem('user');

  if(user) {
    const token = JSON.parse(user)?.token;
    if(!token) return false;

    const decodedToken: { exp: number } = jwtDecode(JSON.parse(user).token);
    const now = Date.now().valueOf() / 1000;

    if (now < decodedToken.exp) {
      return true;
    }

    localStorage.removeItem('user');
  }
  return false;
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if(canNavigate()) return true
  router.navigate(['/login']);
  return false;
};

export const alreadyAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if(canNavigate()) {
    router.navigate(['/todo']);
    return false;
  }
  return true
};
