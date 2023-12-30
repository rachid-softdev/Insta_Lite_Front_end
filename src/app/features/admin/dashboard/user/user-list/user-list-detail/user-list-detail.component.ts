import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../../../core/models/user/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list-detail',
  templateUrl: './user-list-detail.component.html',
  styleUrls: ['./user-list-detail.component.css'],
})
export class UserListDetailComponent {
  private _user: User | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();

  public get getUser(): User | null {
    return this._user;
  }

  @Input()
  public set setUser(user: User | null) {
    this._user = user;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }
}
