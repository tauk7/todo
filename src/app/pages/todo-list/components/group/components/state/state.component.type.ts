export interface Todo {
  id: number;
  title: string;
  description: string;
  done: boolean;
  state_id: number;
  group: number;
  user_id: number;
  user_name: string;
  state?: number;
}
