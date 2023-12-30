import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListDeleteComponent } from './user-list-delete.component';

describe('UserListDeleteComponent', () => {
  let component: UserListDeleteComponent;
  let fixture: ComponentFixture<UserListDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListDeleteComponent],
    });
    fixture = TestBed.createComponent(UserListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
