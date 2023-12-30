import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../public/home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthenticationGuard } from '../../core/guards/authentication-guard';
import { ImageListComponent } from './image-list/image-list.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticationGuard],
    data: {
      role: 'USER',
    },
  },
  {
    path: 'images',
    component: ImageListComponent,
    canActivate: [AuthenticationGuard],
    data: {
      role: 'USER',
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
    data: {
      role: 'USER',
    },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
