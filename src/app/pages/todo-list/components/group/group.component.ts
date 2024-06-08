import { TodoListComponent } from './../../todo-list.component';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TodoService } from '../../../../core/api/todo/todo.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CreateTodoStateComponent } from './components/create-todo-state/create-todo-state.component';
import { StateComponent } from './components/state/state.component';
import { CreateTodoModalComponent } from './components/create-todo-modal/create-todo-modal.component';
import { ConfirmModalComponent } from '../../../../core/components/confirm-modal/confirm-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Group } from '../../todo-list.component.type';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader } from '@angular/material/card';
import { EditGroupModalComponent } from './components/edit-group-modal/edit-group-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { State, User } from './group.component.type';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [MatCard, MatCardContent, MatCardFooter, StateComponent, MatButtonModule, CdkDrag, CdkDropList, CdkDropListGroup],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnChanges{
  @Input() group?: Group;
  states: State[] = [];
  groupForm: FormGroup;
  users: User[] = [];
  userId?: number ;
  canEditGroup: boolean = false;
  @Output() deleteGroupEvent = new EventEmitter<number>();

  constructor(
    public matDialog: MatDialog,
    private todoService: TodoService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private todoListComponent: TodoListComponent
  ) {
    this.userId = this.authService.getUser().user.id;
    this.groupForm = this.formBuilder.group({
      id: [0, Validators.required],
      name: ['', Validators.required],
      users: this.formBuilder.array([])
    });
  }

  async ngOnChanges() {
    await this.initializeGroup();
   }

   async initializeGroup() {
    this.states = [];
    const groupUsers = await this.todoService.getGroupsAndUsers({group_id: this.group?.id, user_id: this.userId}).then((groups: any) => groups.data.getGroupsAndUsers);
    this.canEditGroup = groupUsers[0].is_admin;
    this.states = this.group ? await this.todoService.getStates(this.group.id)
    .then((states: any) => states.data.getStates)
    .then(states => states.sort((a: State, b: State) => a.step - b.step)) : [];
   }

   async drop(event: CdkDragDrop<any>) {
    console.log('batata', event);
    console.log(event.container, event.previousContainer);

   if (event.previousIndex !== event.currentIndex) {

     await this.todoService.updateState({step: this.states[event.currentIndex].step, id: this.states[event.previousIndex].id});
     await this.initializeGroup();
   }

 }

  openEditModal(){
    const dialogRef = this.matDialog.open(EditGroupModalComponent, {
      data: {group: this.group}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result === 'edit') {
        this.todoListComponent.initializeGroups(this.group?.id);
      }
      if(result === 'delete') this.deleteGroupEvent.emit();
    })
  }

  createTodo() {
    const dialogRef = this.matDialog.open(CreateTodoModalComponent, {
      data: { groupId: this.group?.id, states: this.states }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result) {
        this.states = [];
        this.states = this.group ? await this.todoService.getStates(this.group.id).then((states: any) => states.data.getStates) : [];
      }
    });
  }

  createState() {
    const dialogRef = this.matDialog.open(CreateTodoStateComponent, {
      data: { groupId: this.group?.id, states: this.states }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result) {
        await this.todoListComponent.initializeGroups(this.group?.id);
      }
    });
  }

  deleteState(id: number){
    const dialogRef = this.matDialog.open(ConfirmModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.todoService.deleteState(id);
        this.initializeGroup();
      };
    });
  }
}
