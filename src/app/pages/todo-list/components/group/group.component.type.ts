export interface State {
  id: number;
  step: number;
  name: string;
  group?: number;
}

export interface User {
  id: number;
  name: string;
  admin?: boolean;
}
