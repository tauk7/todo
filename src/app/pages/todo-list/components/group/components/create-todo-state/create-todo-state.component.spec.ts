import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTodoStateComponent } from './create-todo-state.component';

describe('CreateTodoStateComponent', () => {
  let component: CreateTodoStateComponent;
  let fixture: ComponentFixture<CreateTodoStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTodoStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTodoStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
