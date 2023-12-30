import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user/user.service';
import { BaseUserMapper } from './models/user/http/mapper/base-user-mapper.model';
import { AuthenticationService } from './services/authentication/authentication.service';
import { TokenStorageService } from './services/token-storage.service';
import { ImageService } from './services/image/image.service';
import { BaseImageMapper } from './models/image/http/mapper/base-image-mapper.model';
import { SelectivePreloadingStrategyService } from './services/preloading/selective-preloading-strategy.service';
import { UserMapper } from './models/user/http/mapper/user-mapper.model';
import { ImageMapper } from './models/image/http/mapper/image-mapper.model';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    UserService,
    AuthenticationService,
    TokenStorageService,
    ImageService,
    BaseImageMapper,
    BaseUserMapper,
    UserMapper,
    ImageMapper,
    SelectivePreloadingStrategyService,
  ],
})
export class CoreModule {}
