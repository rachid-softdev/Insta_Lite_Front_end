import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from '../user/user.component';
import { ProfileComponent } from './profile/profile.component';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageListCreateComponent } from './image-list/image-list-create/image-list-create.component';
import { SharedModule } from '../../shared/shared.module';
import { ImageListDetailComponent } from './image-list/image-list-detail/image-list-detail.component';

@NgModule({
  declarations: [
    UserComponent,
    ProfileComponent,
    ImageListComponent,
    ImageListCreateComponent,
    ImageListDetailComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, UserRoutingModule, SharedModule, AngularSvgIconModule],
  exports: [UserComponent, ProfileComponent, ImageListComponent, ImageListCreateComponent, ImageListDetailComponent],
})
export class UserModule {}
