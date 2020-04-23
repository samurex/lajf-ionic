import { Component, OnInit } from '@angular/core';
import { UserService } from '@lajf-app/mood/services/user.service';
import { Observable, from, of, Subscription, BehaviorSubject } from 'rxjs';
import { User, Declaration, Hashtag } from '@lajf-app/mood/models';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { DeclareModalComponent } from './declare-modal/declare-modal.component';
import { UtilService } from '@lajf-app/core/services';
import { DeclarationService, MoodService } from '@lajf-app/mood/services';
import * as moment from 'moment';

import { Plugins, GeolocationPosition } from '@capacitor/core';
import {
  map,
  mergeMap,
  catchError,
  refCount,
  shareReplay,
  publishReplay,
  debounceTime,
  switchMap,
  takeUntil,
  skip,
  filter,
} from 'rxjs/operators';
import { HashtagService } from '@lajf-app/mood/services/hashtag.service';
const { Storage, Geolocation } = Plugins;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public user$: Observable<User>;
  public declarations$: Observable<Declaration[]>;
  public moods$ = this.moodService.moods$;

  private position$: Observable<{ latitude: number; longitude: number }>;

  public term$ = new BehaviorSubject<string>('');

  // const autocomplete = (time, selector) => (source$) =>
  // source$.pipe(
  //   debounceTime(time),
  //   switchMap((...args: Hashtag[]) =>
  //     selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
  //   )
  // );



  // public results$ = this.term$.pipe(
  //   filter(term => !!term)
  //   debounceTime(time),
  //   switchMap((...args: Hashtag[]) =>
  //   selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
  // )
  //   autocomplete(1000, (term: string) => this.hashtagService.search(term))
  // );

  constructor(
    private userService: UserService,
    private util: UtilService,
    private modalController: ModalController,
    private declarationService: DeclarationService,
    private moodService: MoodService,
    private hashtagService: HashtagService,
    private routerOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {
    this.loadPosition();
    this.loadDashboard();

    from(Storage.get({ key: 'last_declaration' })).subscribe({
      next: async ({ value }) => {
        if (!value || moment().diff(moment(value), 'hours') > 24) {
          await this.openDeclarationModal();
        }
      },
    });
  }
  private loadPosition() {
    this.position$ = this.util
      .wrapRequest(
        from(Geolocation.getCurrentPosition()),
        () => 'Unable to get device location',
        null,
        'Waiting for GPS'
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(null);
        }),
        map((position: GeolocationPosition) => {
          const { latitude = null, longitude = null } =
            position !== null ? position.coords : {};
          return { latitude, longitude };
        }),
        publishReplay(),
        refCount()
      );

    this.position$.subscribe();
  }
  private loadDashboard() {
    this.user$ = this.userService.get();
    this.declarations$ = this.position$.pipe(
      mergeMap((position) => {
        return this.util.wrapRequest(
          this.declarationService.dashboard(position)
        );
      })
    );
  }

  async openDeclarationModal() {
    const modal = await this.modalController.create({
      component: DeclareModalComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        position$: this.position$,
      },
    });
    await modal.present();
    await modal.onWillDismiss();

    Storage.set({ key: 'last_declaration', value: moment().format() });
    this.loadDashboard();
  }
}
