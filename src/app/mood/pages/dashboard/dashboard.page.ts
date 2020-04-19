import { Component, OnInit } from '@angular/core';
import { UserService } from '@lajf-app/mood/services/user.service';
import { Observable, from } from 'rxjs';
import { User, Declaration } from '@lajf-app/mood/models';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { DeclareModalComponent } from './declare-modal/declare-modal.component';
import { UtilService } from '@lajf-app/core/services';
import { DeclarationService } from '@lajf-app/mood/services';
import * as moment from 'moment';

import { Plugins } from '@capacitor/core';
import { map } from 'rxjs/operators';
const { Storage } = Plugins;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public user$: Observable<User>;
  public declarations$: Observable<Declaration[]>;

  constructor(
    private userService: UserService,
    private modalController: ModalController,
    private util: UtilService,
    private declarationService: DeclarationService,
    private routerOutlet: IonRouterOutlet
    ) { }

  ngOnInit() {
    from(Storage.get({ key: 'last_declaration'}))
      .subscribe({
        next: async ({ value }) => {
          if (!value || moment().diff(moment(value), 'hours') > 24) {
            await this.openDeclarationModal();
          }
        }
      });
    this.loadDashboard();
  }
  private loadDashboard() {
    this.user$ = this.userService.get();
    this.declarations$ = this.declarationService.map();
  }

  async openDeclarationModal() {
    const modal = await this.modalController.create({
      component: DeclareModalComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    await modal.onWillDismiss();

    Storage.set({key: 'last_declaration', value: moment().format() });
    this.loadDashboard();
  }
}
