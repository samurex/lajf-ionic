import { Injectable } from '@angular/core';
import { ToastOptions } from '@ionic/core';
import { ToastController } from '@ionic/angular';

const TOAST_DEFAULTS: ToastOptions = {
  duration: 2000,
  position: 'top'
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  private async showToast({ message, header, color }) {
    const element = await this.toastController.create({
      ...TOAST_DEFAULTS,
      message,
      header,
      color
    });
    await element.present();
  }

  async showToastSuccess(message: string, header: string = null) {
    await this.showToast({ message, header, color: 'success' });
  }

  async showToastError(message: string, header: string = null) {
    await this.showToast({ message, header, color: 'danger' });
  }
}
