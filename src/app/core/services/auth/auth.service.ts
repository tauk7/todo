import { Injectable } from '@angular/core';
import { AuthUserWithToken } from './auth.service.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?: AuthUserWithToken;

  constructor() { }

  getUser() {
    if(!this.user) {
      const user = localStorage.getItem("user");
      if(user) this.user = JSON.parse(user);
    }

    if(!this.user) {
      localStorage.removeItem("user");
      window.location.href = '/login';
    }

    return this.user!;
  }
}
