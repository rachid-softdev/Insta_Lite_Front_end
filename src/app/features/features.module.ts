import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { AdminModule } from './admin/admin.module';
import { PublicModule } from './public/public.module';
import { UserModule } from './user/user.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LayoutModule, AdminModule, UserModule, PublicModule, SharedModule],
  exports: [],
})
export class FeaturesModule {}
