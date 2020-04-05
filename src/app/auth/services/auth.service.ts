import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { from, pipe } from 'rxjs';
import { tap, map, delayWhen, mergeMap } from 'rxjs/operators';
import { AuthUser, RegisterData } from '@lajf-app/auth/models';
import { BASE_URL } from '@environments/environment';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const AUTH_STORAGE_KEY = 'auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // hide behaviour subject, expose observable instead
  private loadedSubject$ = new BehaviorSubject<boolean>(false);
  private userSubject$ = new BehaviorSubject<AuthUser>(null);

  constructor(private http: HttpClient) {
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
    return this.http.get<void>(`${BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true })
      .pipe(
        mergeMap(_ => this.http.post<AuthUser>('auth/register', {...registerData }, { withCredentials: true })),
        this.setAuth()
      );
  }

  public logout(): Observable<void> {
    return this.http.post<void>('auth/logout', {})
      .pipe(
        delayWhen(_ => from(Storage.remove({ key: AUTH_STORAGE_KEY }))),
        tap(_ => this.userSubject$.next(null)),
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
