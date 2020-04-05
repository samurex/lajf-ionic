import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages').then(m => m.StartPageModule) },
  { path: 'start', loadChildren: () => import('./pages').then(m => m.StartPageModule) },
  { path: 'register', loadChildren: () => import('./pages').then(m => m.RegisterPageModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
