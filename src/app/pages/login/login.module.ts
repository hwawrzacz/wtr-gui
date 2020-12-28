import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppCommonModule } from 'src/app/app-common-module';
import { CommonMaterialModule } from 'src/app/common-material.module';
import { FaceLoginDialogComponent } from 'src/app/components/dialogs/face-login-dialog/face-login-dialog.component';
import { ImageCaptureModule } from 'src/app/components/image-capture/image-capture.module';

@NgModule({
  declarations: [
    FaceLoginDialogComponent,
  ],
  imports: [
    CommonModule,
    CommonMaterialModule,
    AppCommonModule,
    ImageCaptureModule
  ],
  exports: [
    FaceLoginDialogComponent
  ]
})
export class LoginModule { }
