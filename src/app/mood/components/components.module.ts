import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MoodsPickerComponent } from './moods-picker/moods-picker.component';

@NgModule({
  declarations: [MoodsPickerComponent],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
  ],
  exports: [MoodsPickerComponent],
})
export class ComponentsModule { }
