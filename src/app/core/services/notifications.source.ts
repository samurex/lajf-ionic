import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Notification } from '@lajf-app/core/models';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PluginListenerHandle} from '@capacitor/core';
import { filterNulls } from '../utils/filterNulls';

const { PushNotifications } = Plugins;


@Injectable({
  providedIn: 'root'
})

export class NotificationsSource implements OnDestroy {

  private tokenSubject$ = new BehaviorSubject<string>(null);
  public receivedSubject$ = new BehaviorSubject<Notification>(null);
  private handles: PluginListenerHandle[] = [];

  public get notifications$() {
    return this.receivedSubject$.pipe(filterNulls());
  }

  public get token$() {
    return this.tokenSubject$.pipe(filterNulls());
  }

  private async subscribe() {
    if (this.handles.length > 0) {
      console.error('already subscribed!');
      return;
    }
    try {
      await PushNotifications.register();

      const registerHandle = PushNotifications.addListener('registration', (token: PushNotificationToken) => {
        this.tokenSubject$.next(token.value);
      });
      const errorHandle = PushNotifications.addListener('registrationError', (error: any) => {
        this.receivedSubject$.error(error);
        this.tokenSubject$.error(error);
      });
      const receiveHandle = PushNotifications.addListener('pushNotificationReceived',
        (pushNotification: PushNotification) => {
          this.receivedSubject$.next({ body: pushNotification.body, title: pushNotification.title });
        }
      );
      this.handles = [registerHandle, errorHandle, receiveHandle];
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }

  private unsubscribe() {
    this.handles.forEach(h => h.remove());
    this.handles = [];
    this.receivedSubject$.complete();
    this.tokenSubject$.complete();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  constructor(private platform: Platform) {
    this.platform.ready()
      .then(_ => this.subscribe())
      .catch(err => console.log(err));
  }
}
