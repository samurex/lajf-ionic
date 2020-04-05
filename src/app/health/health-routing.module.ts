import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages').then(m => m.DashboardPageModule) },
  { path: 'declare', loadChildren: () => import('./pages').then(m => m.DeclarePageModule) },
  { path: 'dashboard', loadChildren: () => import('./pages').then(m => m.DashboardPageModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthRoutingModule {}
