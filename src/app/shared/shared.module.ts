import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomPaginatorComponent } from './components/custom-paginator/custom-paginator/custom-paginator.component';
import { ResponsiveHelperComponent } from './components/responsive-helper/responsive-helper.component';
import { PublicHeaderComponent } from './components/header/public-header.component';
import { CanvasDrawingComponent } from './components/canvas-drawing/canvas-drawing.component';
import { HTMLEntityDecode } from './pipes/html-entity-decode.pipe';

@NgModule({
  declarations: [
    CustomPaginatorComponent,
    ResponsiveHelperComponent,
    PublicHeaderComponent,
    CanvasDrawingComponent,
    HTMLEntityDecode,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    CustomPaginatorComponent,
    ResponsiveHelperComponent,
    PublicHeaderComponent,
    CanvasDrawingComponent,
    HTMLEntityDecode,
  ],
  providers: [HTMLEntityDecode]
})
export class SharedModule {}
