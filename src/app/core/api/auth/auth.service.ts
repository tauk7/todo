import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/public/graphql';

  constructor(
    private http: HttpService,
  ) { }

  checkEmailExists(email: string) {
    const payload = {
      query: `
        query User($email: String!) {
          user(email: $email) {
            email
          }
        }
      `,
      variables: {
        email: email
      }
    };
    return this.http.post(this.url, payload);
  }

  createUser(name: string, email: string, password: string) {
    return this.http.post(this.url, {
      query: `
        mutation CreateUser($name: String!, $email: String!, $password: String!) {
          createUser(name: $name, email: $email, password: $password) {
            user {
              id
              name
              email
            }
            token
          }
        }
      `,
      variables: {
        name: name,
        email: email,
        password: password
      }
    });
  }

  auth(email: string, password: string) {
    return this.http.post(this.url, {
      query: `
        query Auth($email: String!, $password: String!) {
          auth(email: $email, password: $password) {
            user {
              id
              name
              email
            }
            token
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    })
  }
}
