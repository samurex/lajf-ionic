import { Component, OnInit } from '@angular/core';
import { UserService } from '@lajf-app/mood/services/user.service';
import { Observable } from 'rxjs';
import { User, Declaration } from '@lajf-app/mood/models';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { DeclareModalComponent } from './declare-modal/declare-modal.component';
import { UtilService } from '@lajf-app/core/services';
import { DeclarationService } from '@lajf-app/mood/services';
import * as moment from 'moment';


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
    this.loadDashboard();
  }
  private loadDashboard() {
    this.user$ = this.userService.get();
    this.declarations$ = this.declarationService.map();

    this.declarationService
      .latest()
      .subscribe({
        next: async declaration => {
          if (!declaration || moment().diff(moment(declaration.created_at), 'hours') > 24) {
            await this.openDeclarationModal();
          }
        }
      });
  }
  async openDeclarationModal() {
    const modal = await this.modalController.create({
      component: DeclareModalComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.loadDashboard();
  }
}
