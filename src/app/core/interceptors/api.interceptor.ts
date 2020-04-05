import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, merge} from 'rxjs';
import { take, mergeMap, filter, tap } from 'rxjs/operators';
import { BASE_URL } from '@environments/environment';
import { AuthService } from '@lajf-app/auth/services';
import { TranslationService } from '@lajf-app/core/services';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private translate: TranslationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return combineLatest([this.auth.loaded$, this.translate.loaded$])
      .pipe(
        filter(([auth, trans]) => auth && trans),
        mergeMap(_ => combineLatest([this.auth.user$, this.translate.lang$])),
        take(1),
        mergeMap(([user, lang]) => {
          let headers = request.headers;
          headers = headers.set('Accept', 'application/json');
          if (user) {
            headers = headers.set('Authorization', `Bearer ${user.token}`);
          }
          if (lang) {
            headers = headers.set('Accept-Language', lang.code);
          }
          const url =  /^(http|https)/.test(request.url) ? request.url : `${BASE_URL}/api/v1/${request.url}`;

          request = request.clone({ url, headers });
          return next.handle(request);
        })
      );
    }
}
