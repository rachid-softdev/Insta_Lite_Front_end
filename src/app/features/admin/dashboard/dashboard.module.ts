import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserListCreateComponent } from './user/user-list/user-list-create/user-list-create.component';
import { UserListDeleteComponent } from './user/user-list/user-list-delete/user-list-delete.component';
import { UserListDetailComponent } from './user/user-list/user-list-detail/user-list-detail.component';
import { UserListUpdateComponent } from './user/user-list/user-list-update/user-list-update.component';
import { SharedModule } from '../../../shared/shared.module';
import { ImageListComponent } from './image/image-list/image-list.component';
import { ImageListCreateComponent } from './image/image-list/image-list-create/image-list-create.component';
import { ImageListDeleteComponent } from './image/image-list/image-list-delete/image-list-delete.component';
import { ImageListDetailComponent } from './image/image-list/image-list-detail/image-list-detail.component';
import { ImageListUpdateComponent } from './image/image-list/image-list-update/image-list-update.component';

import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    DashboardComponent,
    UserListComponent,
    UserListCreateComponent,
    UserListDeleteComponent,
    UserListDetailComponent,
    UserListUpdateComponent,
    ImageListComponent,
    ImageListCreateComponent,
    ImageListDeleteComponent,
    ImageListDetailComponent,
    ImageListUpdateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    /* Importation du module SharedModule pour les app-custom-paginator et app-toast exportés */
    SharedModule,
    AngularSvgIconModule,
  ],
  exports: [
    DashboardComponent,
    UserListComponent,
    UserListCreateComponent,
    UserListDeleteComponent,
    UserListDetailComponent,
    UserListUpdateComponent,
    ImageListComponent,
    ImageListCreateComponent,
    ImageListDeleteComponent,
    ImageListDetailComponent,
    ImageListUpdateComponent
  ],
  providers: [],
})
export class DashboardModule {}
