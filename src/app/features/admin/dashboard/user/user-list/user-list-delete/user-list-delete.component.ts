import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../../../core/models/user/user.model';
import { UserService } from '../../../../../../core/services/user/user.service';

@Component({
  selector: 'app-user-list-delete',
  templateUrl: './user-list-delete.component.html',
  styleUrls: ['./user-list-delete.component.css'],
  providers: [UserService],
})
export class UserListDeleteComponent {
  private _user: User | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _userDeletedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitDeleteUserButtonLoading: boolean = false;

  constructor(private userService: UserService, private _toastrService: ToastrService) {}

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

  @Output()
  public get getUserDeletedEvent(): EventEmitter<boolean> {
    return this._userDeletedEvent;
  }

  public get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitDeleteUserButtonLoading(): boolean {
    return this._isSubmitDeleteUserButtonLoading;
  }

  public set setIsSubmitDeleteUserButtonLoading(isSubmitDeleteUserButtonLoading: boolean) {
    this._isSubmitDeleteUserButtonLoading = isSubmitDeleteUserButtonLoading;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public confirmDelete(): void {
    if (this._user) {
      this._isSubmitDeleteUserButtonLoading = true;
      this.userService.deleteUser(this._user.getPublicId).subscribe({
        next: () => {
          this._errorMessage = null;
          this._isSubmitDeleteUserButtonLoading = false;
          this.toggleDialog();
          this._toastrService.success("L'utilisateur a été supprimé avec succès", "Suppression de l'utilisateur");
          this.getUserDeletedEvent.emit(true);
        },
        error: (error) => {
          if (error.status === 404) {
            this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
          } else {
            this._errorMessage =
              "Une erreur s'est produite lors de la suppression de l'utilisateur : (" +
              error?.status +
              ') - ' +
              error?.error?.message;
          }
          this._isSubmitDeleteUserButtonLoading = false;
          this._toastrService.error(
            `Une erreur est survenue lors de la suppression de l'utilisateur ${this._errorMessage}`,
            "Suppression de l'utilisateur",
          );
          this._userDeletedEvent.emit(false);
        },
      });
    }
  }

  public cancelDelete(): void {
    this.toggleDialog();
  }
}
