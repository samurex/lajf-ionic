import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, BehaviorSubject, Subscription, from, of } from 'rxjs';

import { skip, filter, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoading$: Observable<boolean>;
  private isLoadingSubject$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(null);
  private subscription: Subscription;
  private element: HTMLIonLoadingElement = null;
  private stack = 0;

  constructor(private loadingController: LoadingController) {
    this.subscription = this.isLoadingSubject$
      .pipe(
        filter(l => l !== null),
        concatMap(loading => {
          if (loading && this.stack++ === 0) {
            return from(this.loadingController.create()
                  .then(element => element.present()));
          }
          if (!loading && --this.stack === 0) {
            from(this.loadingController.dismiss());
          }
          return of(null);
        }),
      ).subscribe();
  }

  async showLoading() {
    this.isLoadingSubject$.next(true);
  }

  async hideLoading() {
    this.isLoadingSubject$.next(false);
  }
}
