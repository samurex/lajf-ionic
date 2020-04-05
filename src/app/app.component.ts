import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslationService } from '@lajf-app/core/services';
import { AuthService } from '@lajf-app/auth/services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public translate: TranslationService,
    public auth: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready()
      .then(_ => this.translate.setup())
      .then(_ => this.auth.setup())
      .then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
  }
}
