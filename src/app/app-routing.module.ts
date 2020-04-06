import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuestGuard } from '@lajf-app/auth/guards';
import { HealthGuard } from '@lajf-app/health/guards';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [AuthGuestGuard],
    loadChildren: () => import('@lajf-app/auth/auth-routing.module').then(m => m.AuthRoutingModule),
  },
  {
    path: 'health',
    canActivate: [HealthGuard],
    loadChildren: () => import('@lajf-app/health/health-routing.module').then(m => m.HealthRoutingModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
