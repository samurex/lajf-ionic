import { Component, OnInit } from '@angular/core';
import { UtilService, AlertService } from '@lajf-app/core/services';
import { AuthService } from '@lajf-app/auth/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
  constructor(
    private alertService: AlertService,
    private util: UtilService,
    private auth: AuthService,
    private router: Router,
     ) { }

  async logout() {
    const decision = await this.alertService.confirm('Are you sure?');
    if (decision) {
      this.util.wrapRequest(this.auth.logout())
      .subscribe();
    }
  }

  ngOnInit() {
  }
}
