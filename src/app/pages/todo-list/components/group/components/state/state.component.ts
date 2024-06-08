import { GroupComponent } from './../../group.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoService } from '../../../../../../core/api/todo/todo.service';
import { TodoComponent } from './components/todo/todo.component';
import { AuthService } from '../../../../../../core/services/auth/auth.service';
import { ConfirmModalComponent } from '../../../../../../core/components/confirm-modal/confirm-modal.component';
import { MatFormField } from '@angular/material/form-field';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { State } from '../../group.component.type';
import { Todo } from './state.component.type';
import { TextInputComponent } from '../../../../../../core/components/text-input/text-input.component';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StateEditComponent } from './components/state-edit/state-edit.component';
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [MatFormField, ReactiveFormsModule, MatFormField, MatInputModule, MatSelect, MatOption, TextInputComponent, MatIcon, MatButtonModule, CdkDrag, CdkDropList],
  templateUrl: './state.component.html',
  styleUrl: './state.component.scss'
})
export class StateComponent {
  @Input() state?: State;
  @Input() states?: State[];
  @Output() deleteEvent = new EventEmitter<void>();
  todos: Todo[] = [];
  userId?: number;
  stateForm  = this.formBuilder.group({
    id: [0, Validators.required],
    step: [0, Validators.required],
    name: ['', Validators.required],
  });
  nameControl: FormControl = this.stateForm.get('name') as FormControl;
  editState: boolean = false;

  constructor(
    private todoService: TodoService,
    private matDialog: MatDialog,
    private authService: AuthService,
    private formBuilder:  FormBuilder,
    private groupComponent: GroupComponent
  ) {
  }

 async dropTodo(event: CdkDragDrop<any>) {

    if(event.previousContainer !== event.container) {

    console.log(event);
    console.log('batata', event.container.data, event.previousContainer.data);
    console.log('batata', event.previousContainer !== event.container);
      const state = event.container.data;
      const todo = event.item.data;
      console.log(todo, state);
      await this.todoService.updateTodo({id: todo.id, user_id: this.userId, state: state.id});
      await this.groupComponent.initializeGroup();
    }
  }

  openTodoModal(todo: Todo){
    const dialogRef = this.matDialog.open(TodoComponent, {
      data: { todo, states: this.states, userId: this.userId }
    });

    dialogRef.afterClosed().subscribe( async result => {
      if(result === 'delete') await this.deleteTodo(todo.id);
      if(result === 'edit') {
        this.initialiteTodos();
        this.groupComponent.initializeGroup();
      }
    });
  }

  viewTodoModal(todo: Todo){
    const dialogRef = this.matDialog.open(TodoComponent, {
      data: { todo, states: this.states, userId: this.userId, view: true}
    });
  }

  deleteTodo(id: number){
    const dialogRef = this.matDialog.open(ConfirmModalComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if(result) {
        await this.todoService.deleteTodo(id);
        this.groupComponent.initializeGroup();
        this.initialiteTodos();
      };
    });
  }

  ngOnInit() {
    this.initialiteTodos()
  }

  initialiteTodos() {
    if(!this.state) return;
    this.userId = this.authService.getUser().user.id;
    this.todoService.getTodos(this.state.id, this.userId).then((todos: any) => {
      this.todos = todos.data.getTodos;
    });
    this.stateForm.patchValue({ id: this.state.id, step: this.state.step, name: this.state.name });
  }

  async onSubmit() {
  }

  changeEditState() {
    const dialogRef = this.matDialog.open(StateEditComponent, {
      data: { state: this.state, states: this.states }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result.id) {
        await this.todoService.updateState(result);
        this.groupComponent.initializeGroup();
      }
      if(result === 'delete') this.deleteEvent.emit();
    });
  }
}
