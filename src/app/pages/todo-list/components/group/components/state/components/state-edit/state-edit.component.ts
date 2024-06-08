import { TextInputComponent } from '../../../../../../../../core/components/text-input/text-input.component';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatCheckbox } from '@angular/material/checkbox';
import { State, User } from '../../../../group.component.type';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-state-edit',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, ReactiveFormsModule, MatFormField, MatInputModule, MatSelect, MatOption, MatListOption, MatListModule, MatCheckbox, MatCard, TextInputComponent, MatButtonModule, MatIcon, MatCardHeader, MatCardContent, MatCardTitle, MatCardActions],
  templateUrl: './state-edit.component.html',
  styleUrl: './state-edit.component.scss'
})
export class StateEditComponent implements OnInit{
  stateForm: FormGroup;
  states: State[] = [];
  state: State;
  nameControl: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder:  FormBuilder,
    public dialogRef: MatDialogRef<StateEditComponent>
  ) {
    this.states = this.data.states;
    this.state = this.data.state;
    this.stateForm = this.formBuilder.group({
      id: [this.state.id, Validators.required],
      step: [this.state.step, Validators.required],
      name: [this.state.name, Validators.required],
    });
    this.nameControl = this.stateForm.get('name') as FormControl;
  }

  async ngOnInit() {

  }

  onSubmit() {
    this.stateForm.patchValue({ step: Number(this.stateForm.value.step) });
    this.dialogRef.close(this.stateForm.value);
  }

  onDelete() {
    this.dialogRef.close('delete');
  }
}
