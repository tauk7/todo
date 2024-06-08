import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTodoModalComponent } from './create-todo-modal.component';

describe('CreateTodoModalComponent', () => {
  let component: CreateTodoModalComponent;
  let fixture: ComponentFixture<CreateTodoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTodoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTodoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
