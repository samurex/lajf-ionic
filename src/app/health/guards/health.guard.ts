import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, mergeMap, take } from 'rxjs/operators';

import { AuthService } from '@lajf-app/auth/services';

@Injectable({
  providedIn: 'root'
})
export class HealthGuard implements CanActivate {
  constructor(public router: Router, private auth: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth.loaded$.pipe(
      filter(loaded => !!loaded),
      take(1),
      mergeMap(_ => this.auth.user$),
      map(user => !user ? this.router.parseUrl('/auth') : true),
    );
  }
}
