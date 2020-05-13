import { Component, OnInit } from '@angular/core';
import { UserService } from '@lajf-app/mood/services/user.service';
import { Observable, from, of, Subscription, BehaviorSubject, Subject, iif } from 'rxjs';
import { User, Declaration, Hashtag, DeclarationCard } from '@lajf-app/mood/models';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { DeclareModalComponent } from './declare-modal/declare-modal.component';
import { UtilService } from '@lajf-app/core/services';
import { DeclarationService, MoodService, HashtagService, PositionService } from '@lajf-app/mood/services';
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
  take,
  tap,
} from 'rxjs/operators';

const { Storage } = Plugins;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public user$: Observable<User>;
  public declarations$: Observable<DeclarationCard[]>;
  public moods$ = this.moodService.moods$;

  private position$: Observable<{ latitude: number; longitude: number }>;

  public searchTerm$ = new BehaviorSubject<string>('');
  public searchResults$ = this.searchTerm$.pipe(
    skip(1),
    debounceTime(500),
    switchMap(term => iif(() => term.length === 0, of([]),
      this.hashtagService
          .search(term)
          .pipe(takeUntil(this.searchTerm$.pipe(skip(1))))
      )
    )
  );

  constructor(
    private userService: UserService,
    private util: UtilService,
    private modalController: ModalController,
    private declarationService: DeclarationService,
    private moodService: MoodService,
    private hashtagService: HashtagService,
    private positionService: PositionService,
    private routerOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {
    this.user$ = this.userService.get();
    this.position$ = this.util
      .wrapRequest(
        this.positionService.position$,
        () => 'Unable to get device location',
        null,
        'Waiting for GPS'
      );
 
    this.loadDeclarations(null);

    // declaration modal
    this.position$
      .pipe(
        take(1),
        mergeMap((_) => from(Storage.get({ key: 'last_declaration' })))
      )
      .subscribe({
        next: async ({ value }) => {
          if (!value || moment().diff(moment(value), 'hours') > 24) {
            await this.openDeclarationModal();
          }
        },
      });
  }
  private loadDeclarations(hashtag: Hashtag) {
    this.declarations$ = this.position$.pipe(
      catchError((_) => of(null)),
      mergeMap((position) => {
        return this.util.wrapRequest(
          this.declarationService.dashboard(position, hashtag)
        );
      }),
      map(declarations => {
        return declarations.map(d => ({...d, flipped: false }) as DeclarationCard);
      }),
      tap(_ => this.searchTerm$.next('')),
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
    this.loadDeclarations(null);
  }

  public getDistanceText(distance: number) {
    // 0-2km Here
    // 2-5km Very Close
    // 5-10km Close
    // 10-50km Far
    switch (true) {
      case (distance <= 2):
        return 'Here';
      case distance <= 5:
        return 'Very Close';
      case distance <= 10:
        return 'Close';
      case distance <= 50:
        return 'Far';
      default:
        return 'Very Far';
    }
  }

  public like(declaration: Declaration) {
    declaration.liked = !declaration.liked;
    this.declarationService.like(declaration)
      .subscribe({
        next: _ => {

        }
      })
  }
}
