import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, BehaviorSubject, Subscription, from, of } from 'rxjs';

import { skip, filter, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoading$: Observable<boolean>;
  private isLoadingSubject$: BehaviorSubject<{ loading: boolean, message?: string }> = new BehaviorSubject<
  { loading: boolean, message?: string }
  >(null);
  private subscription: Subscription;
  private element: HTMLIonLoadingElement = null;
  private stack = 0;

  constructor(private loadingController: LoadingController) {
    this.subscription = this.isLoadingSubject$
      .pipe(
        filter(l => l !== null),
        concatMap(({ loading, message }) => {
          if (loading && this.stack++ === 0) {
            return from(this.loadingController.create({ message })
                  .then(element => element.present()));
          }
          if (!loading && --this.stack === 0) {
            from(this.loadingController.dismiss());
          }
          return of(null);
        }),
      ).subscribe();
  }

  async showLoading(message: string = null) {
    this.isLoadingSubject$.next({ loading: true, message });
  }

  async hideLoading() {
    this.isLoadingSubject$.next({ loading: false });
  }
}
