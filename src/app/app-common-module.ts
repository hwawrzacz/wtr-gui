import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonMaterialModule } from './common-material.module';
import { FullScreenLoaderComponent } from './components/full-screen-loader/full-screen-loader.component';

@NgModule({
  declarations: [
    FullScreenLoaderComponent,
  ],
  imports: [
    CommonModule,
    CommonMaterialModule,
  ],
  exports: [
    FullScreenLoaderComponent,
  ]
})
export class AppCommonModule { }
