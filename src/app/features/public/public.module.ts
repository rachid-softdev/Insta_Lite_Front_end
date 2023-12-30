import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from '../public/public.component';
import { HomeModule } from './home/home.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ImageListComponent } from './image-list/image-list.component';

@NgModule({
  declarations: [PublicComponent, ImageListComponent],
  imports: [CommonModule, RouterOutlet, PublicRoutingModule, HomeModule, AuthenticationModule, SharedModule],
  exports: [PublicComponent, ImageListComponent],
})
export class PublicModule {}
