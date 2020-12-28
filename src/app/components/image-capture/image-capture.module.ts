import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppCommonModule } from 'src/app/app-common-module';
import { CommonMaterialModule } from 'src/app/common-material.module';
import { ImageCaptureComponent } from './image-capture.component';

@NgModule({
  declarations: [
    ImageCaptureComponent
  ],
  imports: [
    CommonModule,
    CommonMaterialModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    AppCommonModule,
  ],
  exports: [
    ImageCaptureComponent
  ]
})
export class ImageCaptureModule { }
