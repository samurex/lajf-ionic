import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPage } from '@lajf-app/mood/pages';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    children: [
      { path: '', loadChildren: () => import('./pages').then(m => m.DashboardPageModule) },
      { path: 'dashboard', loadChildren: () => import('./pages').then(m => m.DashboardPageModule) },
      { path: 'settings', loadChildren: () => import('./pages').then( m => m.SettingsPageModule) },
      { path: 'map', loadChildren: () => import('./pages').then( m => m.MapPageModule) }
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
export class MoodRoutingModule {}
