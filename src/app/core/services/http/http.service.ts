import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  token: string = '';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    const user = localStorage.getItem("user");
    if(user) this.token = JSON.parse(user)?.token || '';
  }

  public async get<T>(url: string): Promise<T | undefined> {
    return this.http.get<T>(url).toPromise();
  }

  public async post<T>(url: string, body: any): Promise<T | undefined> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.http.post<T>(url, body, { headers }).toPromise();
  }

  public async postWithAuthorization<T>(url: string, body: any): Promise<T | undefined> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.http.post<T>(url, body, { headers })
    .toPromise()
    .catch((error) => {
      if(error.status === 403) {
        localStorage.removeItem("user");
        this.router.navigate(['/login']);
      }
      return undefined;
    });
  }

  public async put<T>(url: string, body: any): Promise<T | undefined> {
    return this.http.put<T>(url, body).toPromise();
  }
}
