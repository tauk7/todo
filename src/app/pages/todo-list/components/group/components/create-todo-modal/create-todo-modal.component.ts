import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../../../../../core/api/todo/todo.service';
import { AuthService } from '../../../../../../core/services/auth/auth.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { State, User } from '../../group.component.type';
import { MatCard } from '@angular/material/card';
import { TextInputComponent } from '../../../../../../core/components/text-input/text-input.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-todo-modal',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, ReactiveFormsModule, MatFormField, MatInputModule, MatListModule, MatOption, MatSelect, MatCard, TextInputComponent, MatButtonModule],
  templateUrl: './create-todo-modal.component.html',
  styleUrl: './create-todo-modal.component.scss'
})
export class CreateTodoModalComponent {
  userId?: Number;
  states?: State[];
  users?: User[];
  todoForm: FormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    users: [[], Validators.required],
    group: [0, Validators.required],
    state: [0, Validators.required]
  });
  titleControl: FormControl = this.todoForm.get('title') as FormControl;
  descriptionControl: FormControl = this.todoForm.get('description') as FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder:  FormBuilder,
    private todoService: TodoService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateTodoModalComponent>
  ) { }

  async ngOnInit(){
    const users: any = await this.todoService.getUsers()
    this.userId = this.authService.getUser().user.id;
    this.users = users.data.users.filter((user: User) => user.id !== this.userId);
    this.states = this.data.states;
    this.todoForm.patchValue({
      state: this.states![this.states!.length - 1].id,
      group: this.data.groupId
    });
  }

  onSubmit() {
    this.todoForm.patchValue({
      users: [this.userId, ...this.todoForm.value.users.map((id: string) => Number(id))],
      state: Number(this.todoForm.value.state)
    });
    this.todoService.createTodo(this.todoForm.value);
    this.dialogRef.close(true);
  }
}
