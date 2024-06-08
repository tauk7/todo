export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthUserWithToken extends AuthUser {
  token: string;
  user: AuthUser;
}
