import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupModalComponent } from './components/create-group-modal/create-group-modal.component';
import { TodoService } from '../../core/api/todo/todo.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { GroupComponent } from './components/group/group.component';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../core/components/confirm-modal/confirm-modal.component';
import { Group } from './todo-list.component.type';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem, MatListModule, MatListOption, MatSelectionList } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, MatMenu, MatMenuTrigger, GroupComponent, MatCard, MatCardHeader, MatCardTitle, MatButton, MatCardContent, MatList, MatListItem, MatIconModule, MatCardFooter, MatSelectModule, MatOption, ReactiveFormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent  implements OnInit {
  userId?: number;
  groups: Group[] = [];
  group?: Group;
  canEditGroup: boolean = false;
  selectFormControl = this.formBuilder.group({
    group: new FormControl(),
  });
  constructor(
    public matDialog: MatDialog,
    private todoService: TodoService,
    private authService: AuthService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.userId = this.authService.getUser().user.id;
    this.initializeGroups();
  }

  async initializeGroups(id?: number){
    this.groups = [];
    await this.todoService.getGroupsAndUsers({ user_id: this.userId }).then((groups: any) => {
      this.groups = groups.data.getGroupsAndUsers;
      this.group = id ? this.groups.find((group: Group) => group.id === id) : this.groups[0];
      if(this.group?.id) this.selectFormControl.patchValue({group: this.group.id});
    });
    this.canEditGroup = !!this.group?.is_admin;
  }

  createGroup() {
    const dialogRef = this.matDialog.open(CreateGroupModalComponent, {
      data: { userId: this.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.initializeGroups();
    });
  }

  setGroup(groupId: any) {
    console.log(groupId);

    this.group = this.groups.find((group: Group) => group.id === groupId);
    console.log(this.group);

  }

  deleteGroup(){
    const dialogRef = this.matDialog.open(ConfirmModalComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if(result) {
        await this.todoService.deleteGroup(this.group!.id);
        this.initializeGroups();
      }
    }
    );
  }
}
