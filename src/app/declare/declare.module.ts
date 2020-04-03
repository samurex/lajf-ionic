import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeclarePageRoutingModule } from './declare-routing.module';

import { DeclarePage } from './declare.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeclarePageRoutingModule
  ],
  declarations: [DeclarePage]
})
export class DeclarePageModule {}
