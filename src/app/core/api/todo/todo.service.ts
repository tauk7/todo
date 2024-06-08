import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { State, User } from '../../../pages/todo-list/components/group/group.component.type';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private url = 'http://localhost:3000/authenticated/graphql';

  constructor(
    private http: HttpService
    ) {
   }

  createGroup(name: string, users: User[]){
    const payload = {
      query: `
        mutation CreateGroup($name: String!, $users: [UserGroupInput]!) {
          createGroup(name: $name, users: $users) {
            name
          }
        }
      `,
      variables: {
        name,
        users
      }
    };
    return this.http.post(this.url, payload);
  }

  createState(state: State){
    const payload = {
      query: `
        mutation CreateStates($name: String!, $group: Int!, $step: Int!) {
          createStates(name: $name, group: $group, step: $step) {
            name
          }
        }
      `,
      variables: {
        name: state.name,
        group: state.group,
        step: state.step
      }
    };
    return this.http.post(this.url, payload);
  }

  createTodo(todo: any){
    const payload = {
      query: `
        mutation CreateTodo($title: String!, $description: String!, $group: Int!, $users: [Int!]!, $state: Int!) {
          createTodo(title: $title, description: $description, group: $group, users: $users, state: $state) {
            title
          }
        }
      `,
      variables: {
        title: todo.title,
        description: todo.description,
        group: todo.group,
        users: todo.users,
        state: todo.state
      }
    };
    return this.http.post(this.url, payload);
  }

  getUsers() {
    const payload = {
      query: `
      query {
        users {
          id
          name
        }
      }
      `,
    };
    return this.http.post(this.url, payload);
  }

  getGroupsAndUsers( where: any) {
    const payload = {
      query: `
        query GetGroupsAndUsers($where: GroupsWhereInput) {
          getGroupsAndUsers(where: $where) {
            id
            name
            user_id
            is_admin
            user_name
          }
        }
      `,
      variables: {
        where
      },
    };
    return this.http.post(this.url, payload);
  }

  getTodos(state_id: number, user_id: number) {
    const payload = {
      query: `
        query GetTodos($state_id: Int!, $user_id: Int!) {
          getTodos(state_id: $state_id, user_id: $user_id) {
              id
              title
              description
              done
              group
              state_id
              user_id
          }
        }
      `,
      variables: {
        state_id,
        user_id
      },
    };
    return this.http.post(this.url, payload);
  }

  getTodoLogs(todo_id: number) {
    const payload = {
      query: `
        query GetTodoLogs($todo_id: Int!) {
          getTodoLogs(todo_id: $todo_id) {
            id
            user_id
            description
            created_at
          }
        }
      `,
      variables: {
        todo_id,
      },
    };
    return this.http.post(this.url, payload);
  }

  getTodoMembers(todo_id: number) {
    const payload = {
      query: `
        query GetTodoMembers($todo_id: Int!) {
          getTodoMembers(todo_id: $todo_id) {
            user_id
          }
        }
      `,
      variables: {
        todo_id,
      },
    };
    return this.http.post(this.url, payload);
  }

  getStates(id: number) {
    const payload = {
      query: `
        query GetStates($id: Int!) {
          getStates(id: $id) {
              id
              name
              step
          }
        }
      `,
      variables: {
        id,
      },
    };
    return this.http.post(this.url, payload);
  }

  updateTodo(todo: any){
    const payload = {
      query: `
        mutation UpdateTodo($id: Int!, $user_id: Int!, $title: String, $group: Int, $done: Boolean, $description: String, $users: [Int!], $state: Int) {
          updateTodo(id: $id, user_id: $user_id, title: $title, group: $group, done: $done, description: $description, users: $users, state: $state) {
            title
          }
        }
      `,
      variables: {
        id: todo.id,
        user_id: todo.user_id,
        title: todo.title,
        description: todo.description,
        done: todo.done,
        group: todo.group,
        users: todo.users,
        state: todo.state
      }
    };
    return this.http.post(this.url, payload);
  }

  updateState(state: any){
    const payload = {
      query: `
        mutation UpdateState($id: Int!, $name: String, $step: Int) {
          updateState(id: $id, name: $name, step: $step) {
            name
          }
        }
      `,
      variables: {
        id: state.id,
        name: state.name,
        step: state.step
      }
    };
    return this.http.post(this.url, payload);
  }

  updateGroup(group: any){
    const payload = {
      query: `
        mutation UpdateGroup($id: Int!, $name: String!, $users: [UserGroupInput!]!) {
          updateGroup(id: $id, name: $name, users: $users) {
            name
          }
        }
      `,
      variables: {
        id: group.id,
        name: group.name,
        users: group.users
      }
    };
    return this.http.post(this.url, payload);
  }

  deleteGroup(id: number){
    const payload = {
      query: `
        mutation DeleteGroup($id: Int!) {
          deleteGroup(id: $id) {
            id
          }
        }
      `,
      variables: {
        id
      }
    };
    return this.http.post(this.url, payload);
  }

  deleteState(id: number){
    const payload = {
      query: `
        mutation DeleteState($id: Int!) {
          deleteState(id: $id) {
            id
          }
        }
      `,
      variables: {
        id
      }
    };
    return this.http.post(this.url, payload);
  }

  deleteTodo(id: number){
    const payload = {
      query: `
        mutation DeleteTodo($id: Int!) {
          deleteTodo(id: $id) {
            id
          }
        }
      `,
      variables: {
        id
      }
    };
    return this.http.post(this.url, payload);
  }
}
