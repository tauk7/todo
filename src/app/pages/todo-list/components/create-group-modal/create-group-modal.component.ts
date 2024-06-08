import { AuthService } from '../../../../core/services/auth/auth.service';
import { TodoService } from '../../../../core/api/todo/todo.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { User } from '../group/group.component.type';
import { CreateGroupData } from './create-group-modal.component.type';
import { MatCard } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TextInputComponent } from '../../../../core/components/text-input/text-input.component';

@Component({
  selector: 'app-create-group-modal',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, ReactiveFormsModule, MatFormField, MatInputModule, MatListModule, MatCard, MatButtonModule, TextInputComponent],
  templateUrl: './create-group-modal.component.html',
  styleUrl: './create-group-modal.component.scss'
})
export class CreateGroupModalComponent implements OnInit {
  users?: User[];
  groupForm: FormGroup = this.formBuilder.group({
    name: new FormControl('', Validators.required) as FormControl,
    users: [[]]
  });
  nameControl: FormControl = this.groupForm.get('name') as FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateGroupData,
    private formBuilder:  FormBuilder,
    private todoService: TodoService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateGroupModalComponent>
  ) { }

  async ngOnInit(){
    const users: any = await this.todoService.getUsers()
    this.data.userId = this.authService.getUser().user.id;
    this.users = users.data.users.filter((user: User) => user.id !== this.data.userId);
  }

  onSubmit() {
    const users = this.groupForm.value.users.map((id: User) => {
      return {id: Number(id), admin: false};
    });
    users.push({id: this.data.userId, admin: true});
    this.todoService.createGroup(this.groupForm.value.name, users);
    this.dialogRef.close(true);
  }
}
