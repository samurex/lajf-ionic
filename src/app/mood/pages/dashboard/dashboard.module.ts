import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { DeclareModalComponent } from './declare-modal/declare-modal.component';
import { ComponentsModule } from '@lajf-app/mood/components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    DashboardPageRoutingModule
  ],
  declarations: [DeclareModalComponent, DashboardPage],
  entryComponents: [DeclareModalComponent],
})
export class DashboardPageModule {}
