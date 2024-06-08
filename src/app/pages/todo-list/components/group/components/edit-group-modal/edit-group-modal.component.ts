import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { State, User } from "../../group.component.type";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { CreateGroupData } from "../../../create-group-modal/create-group-modal.component.type";
import { TodoService } from "../../../../../../core/api/todo/todo.service";
import { AuthService } from "../../../../../../core/services/auth/auth.service";
import { TextInputComponent } from "../../../../../../core/components/text-input/text-input.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatListModule, MatSelectionListChange } from "@angular/material/list";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatCheckbox } from "@angular/material/checkbox";
import { Group } from "../../../../todo-list.component.type";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-edit-group-modal',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, ReactiveFormsModule, MatFormField, MatInputModule, MatListModule, MatCard, MatButtonModule, TextInputComponent, MatCheckbox, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatIcon],
  templateUrl: './edit-group-modal.component.html',
  styleUrl: './edit-group-modal.component.scss'
})
export class EditGroupModalComponent {
  states: State[] = [];
  users: User[] = [];
  group: Group;
  groupForm: FormGroup = this.formBuilder.group({
    id: [0, Validators.required],
    name: ['', Validators.required],
    users: this.formBuilder.array([])
  });
  nameControl: FormControl = this.groupForm.get('name') as FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder:  FormBuilder,
    private todoService: TodoService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<EditGroupModalComponent>
  ) {
    this.group = this.data.group;
  }

  async ngOnInit(){
    console.log(this.data);
    console.log(this.group);

    const users: any = await this.todoService.getUsers()
    this.data.userId = this.authService.getUser().user.id;
    this.users = users.data.users.filter((user: User) => user.id !== this.data.userId);
    this.initializeUsers();
  }

  async initializeUsers() {
    const userGroup = await this.todoService.getGroupsAndUsers({group_id: this.group.id}).then((groups: any) => groups.data.getGroupsAndUsers.map((group: Group) => {
      return this.formBuilder.group({
        id: [group.user_id, Validators.required],
        admin: [group.is_admin, Validators.required]
      });
    }));
    const usersControl = this.groupForm.get('users') as FormArray;
    this.groupForm.patchValue({id: this.group.id, name: this.group.name});
    userGroup.forEach((group: Group) => usersControl.push(group));
    const users = await this.todoService.getUsers().then((users: any) => users.data.users.map((user: User) => {
      let admin = userGroup.find((group: FormControl) => group.value.id === user.id)?.value.admin || false;
      return {id: user.id, name: user.name, admin}
    }));
    const userId = this.authService.getUser().user.id;
    this.users = users.filter((user: User) => user.id !== userId);
    this.states = await this.todoService.getStates(this.group.id).then((states: any) => states.data.getStates);
  }

  onSelectionChange(event: MatSelectionListChange) {
    const usersControl = this.groupForm.get('users') as FormArray;

    event.options.forEach(option => {
      if (option.selected) {
        const userGroup = this.formBuilder.group({
          id: [option.value, Validators.required],
          admin: [false, Validators.required]
        });
        usersControl.push(userGroup);
      } else {
        let i = 0;
        for (let user of usersControl.controls) {
          if (user.get('id')?.value === option.value) {
            usersControl.removeAt(i);
            return;
          }
          i++;
        }
      }
    });
  }

  isSelected(userId: number) {
    const usersControl = this.groupForm.get('users') as FormArray;
    return usersControl.controls.some(user => user.get('id')?.value === userId);
  }

  setAdminUser(userId: number) {
    const usersControl = this.groupForm.get('users') as FormArray;
    const user = usersControl.controls.find(user => user.get('id')?.value === userId);
    if (user) {
      user.get('admin')?.setValue(!user.get('admin')?.value);
    }
  }

  onDelete(){
    this.dialogRef.close('delete');
  }
  onSubmit() {
    this.todoService.updateGroup(this.groupForm.value);
    this.dialogRef.close('edit');
  }
}
