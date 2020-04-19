import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { from, pipe } from 'rxjs';
import { tap, map, delayWhen, mergeMap, catchError } from 'rxjs/operators';
import { AuthUser, RegisterData } from '@lajf-app/auth/models';
import { BASE_URL } from '@environments/environment';

import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { Storage } = Plugins;

const AUTH_STORAGE_KEY = 'auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // hide behaviour subject, expose observable instead
  private loadedSubject$ = new BehaviorSubject<boolean>(false);
  private userSubject$ = new BehaviorSubject<AuthUser>(null);

  constructor(private http: HttpClient, private router: Router) {
  }

  public async setup() {
    const user = await Storage.get({ key: AUTH_STORAGE_KEY });
    this.userSubject$.next(JSON.parse(user.value));
    this.loadedSubject$.next(true);
  }

  public get loaded$() {
    return this.loadedSubject$.asObservable();
  }

  public get user$() {
    return this.userSubject$.asObservable();
  }

  public register(registerData: RegisterData): Observable<AuthUser> {
    return this.http.post<AuthUser>('auth/register', {...registerData })
      .pipe(this.setAuth());
  }

  public logout(api: boolean = true, remove: boolean = false): Observable<void> {
    const obs = api ? this.http.post<void>('auth/logout', { remove }) : of(null);
    return obs.pipe(
      delayWhen(_ => from(Storage.clear())),
      tap(_ => this.userSubject$.next(null)),
      tap(_ => location.reload())
    );
  }


  // rxjs operator, sets auth from response
  private setAuth = () => pipe(
      map<{ token: string }, AuthUser>(user => ({
        token: user.token,
      })),
      delayWhen(user => from(Storage.set({ key: AUTH_STORAGE_KEY, value: JSON.stringify(user) }))),
      tap(user => this.userSubject$.next(user)),
  )
}
