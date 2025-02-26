import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPage } from '@lajf-app/health/pages';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    children: [
      { path: '', loadChildren: () => import('./pages').then(m => m.DashboardPageModule) },
      { path: 'dashboard', loadChildren: () => import('./pages').then(m => m.DashboardPageModule) },
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    IonicModule,
    CommonModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [LayoutPage],
})
export class HealthRoutingModule {}
