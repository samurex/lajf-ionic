import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FacebookButtonComponent } from './facebook-button.component';

@NgModule({
  declarations: [FacebookButtonComponent],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
  ],
  exports: [FacebookButtonComponent],
})
export class ComponentsModule { }

