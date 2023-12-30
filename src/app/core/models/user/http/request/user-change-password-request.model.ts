import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';

export class UserChangePasswordRequest implements Serialize<object>, Deserialize<string> {
  private _publicId: string;
  private _currentPassword: string;
  private _newPassword: string;
  private _confirmPassword: string;

  constructor(
    publicId: string = '',
    currentPassword: string = '',
    newPassword: string = '',
    confirmPassword: string = '',
  ) {
    this._publicId = publicId;
    this._currentPassword = currentPassword;
    this._newPassword = newPassword;
    this._confirmPassword = confirmPassword;
  }

  public get getPublicId(): string {
    return this._publicId;
  }

  public set setPublicId(publicId: string) {
    this._publicId = publicId;
  }

  public get getCurrentPassword(): string {
    return this._currentPassword;
  }

  public set setCurrentPassword(currentPassword: string) {
    this._currentPassword = currentPassword;
  }

  public get getNewPassword(): string {
    return this._newPassword;
  }

  public set setNewPassword(newPassword: string) {
    this._newPassword = newPassword;
  }

  public get getConfirmPassword(): string {
    return this._confirmPassword;
  }

  public serialize(): object {
    return {
      public_id: this.getPublicId,
      current_password: this.getCurrentPassword,
      new_password: this.getNewPassword,
      confirm_password: this.getConfirmPassword,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `UserChangePasswordRequest [publicId=${this._publicId}, currentPassword=${this._currentPassword}, newPassword=${this._newPassword}, confirmPassword=${this._confirmPassword}]`;
  }
}
