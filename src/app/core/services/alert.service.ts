import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private ALERT_BUTTONS = [
    {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
    }, {
        text: 'Ok',
        role: 'ok',
    }
  ];

  constructor(private alertController: AlertController) { }

  async confirm(header: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      buttons: this.ALERT_BUTTONS
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role === 'ok';
  }
}
