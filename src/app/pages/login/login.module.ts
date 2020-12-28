import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from 'src/app/app-common-module';
import { CommonMaterialModule } from 'src/app/common-material.module';
import { FaceLoginDialogComponent } from 'src/app/components/dialogs/face-login-dialog/face-login-dialog.component';
import { QrCodeLoginDialogComponent } from 'src/app/components/dialogs/qr-code-login-dialog/qr-code-login-dialog.component';
import { ImageCaptureModule } from 'src/app/components/image-capture/image-capture.module';

@NgModule({
  declarations: [
    FaceLoginDialogComponent,
  ],
  imports: [
    CommonModule,
    CommonMaterialModule,
    AppCommonModule,
    ImageCaptureModule,
    QrCodeLoginDialogComponent,
  ],
  exports: [
    FaceLoginDialogComponent
  ]
})
export class LoginModule { }
