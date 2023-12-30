import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../../../core/models/user/user.model';
import { UserService } from '../../../../../core/services/user/user.service';
import { UserPageResponse } from '../../../../../core/models/user/http/response/user-page-response.model';
import { BaseUserMapper } from '../../../../../core/models/user/http/mapper/base-user-mapper.model';
import { BaseUserResponse } from '../../../../../core/models/user/http/response/base-user-response.model';
import { UserResponseAPI } from '../../../../../core/models/user/http/response/user-response-api.model';

enum DialogType {
  AddUser,
  UserUpdate,
  UserDetail,
  UserDelete,
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [UserService, BaseUserMapper],
})
export class UserListComponent implements OnInit, OnDestroy {
  public DialogType = DialogType;
  private _dialogState: Record<DialogType, boolean> = {
    [DialogType.AddUser]: false,
    [DialogType.UserUpdate]: false,
    [DialogType.UserDetail]: false,
    [DialogType.UserDelete]: false,
  };

  private _userPageResponse: UserPageResponse = new UserPageResponse();

  private users: User[] = [
    new User('id-1', '2023-09-20T10:00:00Z', '2023-09-20T14:30:00Z', 'John', 'Doe', 'john.doe@email.com', 'USER'),
    new User('id-2', '2023-09-19T09:15:00Z', '2023-09-19T16:45:00Z', 'Jane', 'Smith', 'jane.smith@email.com', 'USER'),
    new User(
      'id-3',
      '2023-09-19T08:00:00Z',
      '2023-09-19T18:00:00Z',
      'Alfred',
      'Cook',
      'alfred.cook@email.com',
      'ADMIN',
    ),
  ];

  private _selectedUser: User | null = null;

  private _newUser: User = new User();

  private _currentPage: number = 0;

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.users = [];
  }

  constructor(private _userService: UserService, private _userMapper: BaseUserMapper) {}

  public get getDialogState(): Record<DialogType, boolean> {
    return this._dialogState;
  }

  public set setDialogState(dialogState: Record<DialogType, boolean>) {
    this._dialogState = dialogState;
  }

  public get getUserPageResponse(): UserPageResponse {
    return this._userPageResponse;
  }

  public set setUserPageResponse(value: UserPageResponse) {
    this._userPageResponse = value;
  }

  public get getUsers(): User[] {
    return this.users;
  }

  public set setUsers(users: User[]) {
    this.users = users;
  }

  public get getNewUser(): User {
    return this._newUser;
  }

  public set setNewUser(newUser: User) {
    this._newUser = newUser;
  }

  public get getSelectedUser(): User | null {
    return this._selectedUser;
  }

  public set setSelectedUser(user: User | null) {
    this._selectedUser = user;
  }

  public get getCurrentPage(): number {
    return this._currentPage;
  }

  public set setCurrentPage(currentPage: number) {
    this._currentPage = currentPage;
  }

  searchByName: string = '';
  onSearch(event: Event): void {
    if (event.target as HTMLInputElement) {
      const value = (event.target as HTMLInputElement).value.trim();
      if (!value || value.length === 0) {
        this.loadUsers();
        return;
      }
      this.searchByName = value;
      this.setUsers = this.users.filter((user) =>
        user.getLastname.toLowerCase().includes(this.searchByName.toLowerCase()),
      );
    }
  }

  public loadUsers(): void {
    const page: number = this.getCurrentPage;
    const size: number = this.getUserPageResponse?.size ?? 10;
    const sortBy: string = 'createdAt';
    const sortOrder: string = 'asc';
    this._userService.getAllUsersPaginated(page, size, sortBy, sortOrder).subscribe((response: UserPageResponse) => {
      this.setUserPageResponse = response;
      const usersResponse: BaseUserResponse[] =
        this._userPageResponse?.content?.map((apiData: UserResponseAPI) => this._userMapper.deserialize(apiData)) ||
        [];
      const users = usersResponse.map((userResponse) => this._userMapper.toUser(userResponse));
      this.setUsers = users;
      this.setCurrentPage = page;
    });
  }

  public toggleDialog(dialogType: DialogType): void {
    this._dialogState[dialogType] = !this._dialogState[dialogType];
  }

  public pageChanged(event: number): void {
    this.setCurrentPage = event - 1;
    this.loadUsers();
  }

  public onUserCreated(): void {
    this.loadUsers();
  }

  public onUserUpdateClick(user: User): void {
    this.setSelectedUser = user;
    this.toggleDialog(DialogType.UserUpdate);
  }

  public onUserUpdated(): void {
    this.loadUsers();
  }

  public onUserDetailClick(user: User): void {
    this.setSelectedUser = user;
    this.toggleDialog(DialogType.UserDetail);
  }

  public onUserDeleteClick(user: User): void {
    this.setSelectedUser = user;
    this.toggleDialog(DialogType.UserDelete);
  }

  public onUserDeleted(): void {
    this.loadUsers();
  }
}
