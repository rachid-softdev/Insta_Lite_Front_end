import { Role, RoleManager } from '../../../../../core/constants/ERole';
import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';

export class UserUpdateRequest implements Serialize<object>, Deserialize<string> {
  private _publicId: string;
  private _createdAt: string;
  private _updatedAt: string;
  private _lastname: string;
  private _firstname: string;
  private _email: string;
  private _password: string;
  private _role: Role | null;

  constructor(
    publicId: string = '',
    createdAt: string = '',
    updatedAt: string = '',
    lastname: string = '',
    firstname: string = '',
    email: string = '',
    password: string = '',
    role: Role | null = RoleManager.NONE,
  ) {
    this._publicId = publicId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._lastname = lastname;
    this._firstname = firstname;
    this._email = email;
    this._password = password;
    this._role = role;
  }

  public get getPublicId(): string {
    return this._publicId;
  }

  public set setPublicId(publicId: string) {
    this._publicId = publicId;
  }

  public get getCreatedAt(): string {
    return this._createdAt;
  }

  public set setCreatedAt(createdAt: string) {
    this._createdAt = createdAt;
  }

  public get getUpdatedAt(): string {
    return this._updatedAt;
  }

  public set setUpdatedAt(updatedAt: string) {
    this._updatedAt = updatedAt;
  }

  public get getLastname(): string {
    return this._lastname;
  }

  public set setLastname(lastname: string) {
    this._lastname = lastname;
  }

  public get getFirstname(): string {
    return this._firstname;
  }

  public set setFirstname(firstname: string) {
    this._firstname = firstname;
  }

  public get getEmail(): string {
    return this._email;
  }

  public set setEmail(email: string) {
    this._email = email;
  }

  public get getPassword(): string {
    return this._password;
  }

  public set setPassword(password: string) {
    this._password = password;
  }

  public get getRole(): Role | null {
    return this._role;
  }

  public set setRole(role: Role | null) {
    this._role = role;
  }

  public serialize(): object {
    return {
      public_id: this.getPublicId,
      lastname: this.getLastname,
      firstname: this.getFirstname,
      email: this.getEmail,
      password: this.getPassword,
      role: this.getRole?.getName,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `UserUpdateRequest [publicId=${this._publicId}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt} lastname=${this._lastname}, firstname=${this._firstname}, email=${this._email}, password=${this._password}, role=${this._role}]`;
  }
}
