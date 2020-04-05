import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagesComponent } from './languages.component';

@NgModule({
  declarations: [LanguagesComponent],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
  ],
  exports: [LanguagesComponent],
})
export class ComponentsModule { }

