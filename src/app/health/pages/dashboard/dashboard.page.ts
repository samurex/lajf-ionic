import { Component, OnInit } from '@angular/core';
import { UserService } from '@lajf-app/health/services/user.service';
import { Observable } from 'rxjs';
import { User } from '@lajf-app/health/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public user$: Observable<User>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user$ = this.userService.get();
  }
}
