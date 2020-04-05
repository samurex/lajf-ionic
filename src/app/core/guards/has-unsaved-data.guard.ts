import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanDeactivate } from '@angular/router';

import { HasUnsavedData } from './has-unsaved-data';
import { AlertService } from '@lajf-app/core/services';

@Injectable({
  providedIn: 'root'
})
export class HasUnsavedDataGuard implements CanDeactivate<HasUnsavedData> {
  constructor(private alertService: AlertService) {}
  canDeactivate(
    component: HasUnsavedData,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (component.hasUnsavedData && component.hasUnsavedData()) {
      return this.alertService.confirm('Are you sure you want to cancel editing?');
    }
    return true;
  }
}
