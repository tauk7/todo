import { State } from "../../../../group.component.type";
import { Todo } from "../../state.component.type";

export interface TodoLog {
  id: number;
  description: string;
  user_id: number;
  created_at: string;
}

export interface TodoMember {
  user_id: number;
  todo_id: number;
}

export interface TodoData {
  todo: Todo;
  states: State[];
  userId: number;
  view?: boolean;
}
