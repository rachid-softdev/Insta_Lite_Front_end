import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListCreateComponent } from './user-list-create.component';

describe('UserListCreateComponent', () => {
  let component: UserListCreateComponent;
  let fixture: ComponentFixture<UserListCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListCreateComponent],
    });
    fixture = TestBed.createComponent(UserListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
