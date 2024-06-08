import { TextInputComponent } from './../../../../../../../../core/components/text-input/text-input.component';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatOption, MatSelect } from '@angular/material/select';
import { TodoService } from '../../../../../../../../core/api/todo/todo.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatCheckbox } from '@angular/material/checkbox';
import { Todo } from '../../state.component.type';
import { State, User } from '../../../../group.component.type';
import { TodoData, TodoLog, TodoMember } from './todo.component.type';
import { Group } from '../../../../../../todo-list.component.type';
import { MatCard } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, ReactiveFormsModule, MatFormField, MatInputModule, MatSelect, MatOption, MatListOption, MatListModule, MatCheckbox, MatCard, TextInputComponent, MatButtonModule, MatIcon],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit{
  @Input() todo: Todo;
  states: State[];
  users?: User[];
  userId: number;
  todoForm: FormGroup;
  todoLogs: TodoLog[] = [];
  todoMembers: TodoMember[] = [];
  groups: Group[] = [];
  titleControl: FormControl;
  descriptionControl: FormControl;
  onlyView: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TodoData,
    private formBuilder:  FormBuilder,
    private todoService: TodoService,
    public dialogRef: MatDialogRef<TodoComponent>
  ) {
    this.todo = this.data.todo;
    this.states = this.data.states;
    this.states.forEach((state: State) => state.id = state.id);
    this.userId = this.data.userId;
    this.onlyView = !!this.data.view;
    this.todoForm = this.formBuilder.group({
      id: [this.todo.id, Validators.required],
      user_id: [0, Validators.required],
      title: [this.todo.title, [Validators.required]],
      description: [this.todo.description, Validators.required],
      done: [this.todo.done, Validators.required],
      state: [this.todo.state_id, Validators.required],
      group: [this.todo.group, Validators.required],
      users: [[], Validators.required]
    });
    this.titleControl = this.todoForm.get('title') as FormControl;
    this.descriptionControl = this.todoForm.get('description') as FormControl;
  }

  async ngOnInit() {
    await this.todoService.getTodoLogs(this.todo.id).then((logs: any) => {
      this.todoLogs = logs.data.getTodoLogs;
    });
    this.todoLogs.sort((a, b) => b.id - a.id);
    await this.todoService.getTodoMembers(this.todo.id).then((members: any) => {
      this.todoMembers = members.data.getTodoMembers.filter((member: TodoMember) => member.user_id !== this.todo.user_id);
    });
    this.users = await this.todoService.getUsers().then((users: any) => {
      return users.data.users.filter((user: User) => user.id !== this.todo.user_id);
    });
    this.groups = await this.todoService.getGroupsAndUsers({user_id: this.userId}).then((groups: any) => groups.data.getGroupsAndUsers.map((group: any) => {
      group.id = group.id;
      return group;
    }));
    this.groupValueChanges()
    this.todoForm.patchValue({users: this.todoMembers.map((member: TodoMember) => member.user_id)});
  }

  async groupValueChanges() {
    this.todoForm.get('group')?.valueChanges.subscribe((group: Group) => {
      this.todoService.getStates(Number(group)).then((states: any) => {
        this.states = states.data.getStates;
        this.todoForm.patchValue({state: this.states[0].id});
      });
    });
  }

  async onSubmit() {
    this.todoForm.patchValue({
      users: [this.todo.user_id, ...this.todoForm.value.users.map((id: string) => Number(id))],
      user_id: this.userId,
      state: Number(this.todoForm.value.state),
    });
    await this.todoService.updateTodo(this.todoForm.value);
    this.dialogRef.close('edit');
  }

  onDelete() {
    this.dialogRef.close('delete');
  }
}
