import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { ImageListComponent } from './image/image-list/image-list.component';
import { AuthenticationGuard } from '../../../core/guards/authentication-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticationGuard],
    data: {
      role: 'ADMIN',
    },
    children: [
      {
        path: 'users',
        component: UserListComponent,
        canActivateChild: [AuthenticationGuard],
        data: {
          role: 'ADMIN',
        },
      },
      {
        path: 'images',
        component: ImageListComponent,
        canActivateChild: [AuthenticationGuard],
        data: {
          role: 'ADMIN',
        },
      },
      { path: '**', redirectTo: 'users' },
    ],
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
