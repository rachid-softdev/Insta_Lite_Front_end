import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListUpdateComponent } from './user-list-update.component';

describe('UserListUpdateComponent', () => {
  let component: UserListUpdateComponent;
  let fixture: ComponentFixture<UserListUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListUpdateComponent],
    });
    fixture = TestBed.createComponent(UserListUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
