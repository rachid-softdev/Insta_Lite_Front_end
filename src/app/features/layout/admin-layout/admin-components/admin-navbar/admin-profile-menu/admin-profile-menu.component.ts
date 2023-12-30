import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../../shared/directives/click-outside.directive';
import { User } from '../../../../../../core/models/user/user.model';
import { TokenStorageService } from '../../../../../../core/services/token-storage.service';
import { AuthenticationService } from '../../../../../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-admin-profile-menu',
  templateUrl: './admin-profile-menu.component.html',
  styleUrls: ['./admin-profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink],
})
export class AdminProfileMenuComponent implements OnInit, OnDestroy {
  public isMenuOpen = false;
  private _user: User | null;

  constructor(private _tokenStorageService: TokenStorageService, private _authenticationService: AuthenticationService) {
    this._user = _tokenStorageService.getUser();
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  public get getUser(): User | null {
    return this._user;
  }

  public set setUser(user: User | null) {
    this._user = user;
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public logout(): void {
    this._authenticationService.logout();
  }
}
