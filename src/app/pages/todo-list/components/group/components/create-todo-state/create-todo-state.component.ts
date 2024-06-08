import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { TodoService } from '../../../../../../core/api/todo/todo.service';
import { AuthService } from '../../../../../../core/services/auth/auth.service';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatOption, MatSelect } from '@angular/material/select';
import { State } from '../../group.component.type';
import { CreateTodoStateData } from './create-todo-state.component.type';
import { MatCard } from '@angular/material/card';
import { TextInputComponent } from '../../../../../../core/components/text-input/text-input.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-todo-state',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, ReactiveFormsModule, MatFormField, MatInputModule, MatSelect, MatOption, MatCard, TextInputComponent, MatButtonModule],
  templateUrl: './create-todo-state.component.html',
  styleUrl: './create-todo-state.component.scss'
})
export class CreateTodoStateComponent {
  steps: number[] = [1];
  stateForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    step: [0, Validators.required],
    group: [0, Validators.required],
  });
  nameControl: FormControl = this.stateForm.get('name') as FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateTodoStateData,
    private formBuilder:  FormBuilder,
    private todoService: TodoService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateTodoStateComponent>
  ) {  }

  ngOnInit() {
    const state = this.data.states;
    if(state.length){
      this.steps = state.map((state: State) => state.step).sort();
      this.steps.push(this.steps[this.steps.length - 1] + 1);
    }
    this.stateForm.patchValue({step: this.steps[this.steps.length - 1], group: this.data.groupId});
    console.log(this.steps);

  }
  onSubmit() {
    this.todoService.createState(this.stateForm.value);
    this.dialogRef.close(true);
  }
}
