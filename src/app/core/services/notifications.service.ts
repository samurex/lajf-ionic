import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, Subscription, forkJoin } from 'rxjs';
import { tap, filter, delayWhen, take } from 'rxjs/operators';
import { mergeMap, switchMap } from 'rxjs/operators';
import { Notification } from '../models';
import { NotificationsSource } from './notifications.source';
import { AuthService } from '@lajf-app/auth/services';

type Device = 'ios' | 'android';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService implements OnDestroy {
  private unreadSubject$ = new BehaviorSubject<number>(0);
  public notifSubject$ = new BehaviorSubject<Notification[]>(null);
  public subscription: Subscription;

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private systemNotifications: NotificationsSource,
    private auth: AuthService,
  ) {
    }

    public async setup() {
      return this.auth.user$.pipe(
        filter(user => !!user),
        take(1),
        tap(_ => this.subscribe())
      ).toPromise();
    }

    private subscribe() {
      // from push
      this.subscription = this.systemNotifications.notifications$
        .subscribe({
          next: notification => {
            this.unreadSubject$.next(this.unreadSubject$.getValue() + 1);
            this.notifSubject$.next([...this.notifSubject$.getValue(), notification]);
          }
        });

      this.systemNotifications.token$
        .pipe(
          take(1),
          tap(token => console.log('TOKEN', token)),
          // update token
          delayWhen(token => this.http.post('notifications/token', {
              token,
              device: this.platform.is('android') ? 'android' : 'ios',
            }),
          ),
          // get notifications from api
          mergeMap(token => forkJoin([
              this.http.get<Notification[]>(`notifications/${token}`),
              this.http.get<{ count: number}>(`notifications/${token}/count`)
          ]))
        ).subscribe({
          next: ([notifications, count]) => {
            this.notifSubject$.next([...notifications]);
            this.unreadSubject$.next(count.count);
          }
        });
    }
    private unsubscribe() {
      this.subscription.unsubscribe();
    }

    get notifications$() {
      return this.notifSubject$.asObservable();
    }

    get unread$() {
      return this.unreadSubject$.asObservable();
    }

    removeToken() {
      return this.systemNotifications.token$
        .pipe(
          tap(token => console.log(token)),
          switchMap(token => this.http.delete(`notifications/token/${token}`)),
          tap(_ => this.unsubscribe()),
          tap(_ => this.systemNotifications.ngOnDestroy()),
        );
    }

    markAsRead() {
      return this.unreadSubject$.getValue() > 0 ?
       this.systemNotifications.token$
          .pipe(
            switchMap(token => this.http.patch(`notifications/${token}/read`, {})),
            tap(_ => this.unreadSubject$.next(0)),
          ) : of(null);
    }

    ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
}
