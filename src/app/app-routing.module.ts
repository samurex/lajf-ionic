import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuestGuard } from '@lajf-app/auth/guards';
import { MoodGuard } from '@lajf-app/mood/guards';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [AuthGuestGuard],
    loadChildren: () => import('@lajf-app/auth/auth-routing.module').then(m => m.AuthRoutingModule),
  },
  {
    path: 'mood',
    canActivate: [MoodGuard],
    loadChildren: () => import('@lajf-app/mood/mood-routing.module').then(m => m.MoodRoutingModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
