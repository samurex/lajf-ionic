import { Component, OnInit } from '@angular/core';
import { UtilService } from '@lajf-app/core/services';
import { AuthService } from '@lajf-app/auth/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
  constructor(
    private util: UtilService,
    private auth: AuthService,
    private router: Router,
     ) { }

  logout() {
    this.util.wrapRequest(this.auth.logout())
      .subscribe({
        complete: () => {
          this.router.navigate(['/auth']);
        },
      });
  }

  ngOnInit() {
  }
}
