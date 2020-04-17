import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UtilService, AlertService } from '@lajf-app/core/services';

import {  UserService } from '@lajf-app/mood/services';
import { Observable, of, from } from 'rxjs';
import { User } from '@lajf-app/mood/models';
import { tap, mergeMap } from 'rxjs/operators';
import { AuthService } from '@lajf-app/auth/services';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private user$: Observable<User>;
  public settingsForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private util: UtilService,
    private auth: AuthService,
    private userService: UserService,
    private alertService: AlertService,
  ) {
    this.settingsForm = this.formBuilder.group({
      age: [null, Validators.required],
      gender: [null, Validators.required],
      city: [null, null],
      kids: [null, null],
      occupation:  [null, null]
    });
   }

  ngOnInit() {
    this.user$ = this.userService.get()
      .pipe(
        tap(user => {
          this.settingsForm.patchValue(user);
        }),
      );
  }

  update(form: FormGroup): void {
    if (form.valid) {
      this.util.wrapRequest(this.userService.save(form.value), null,
        _ => 'Settings updated successfully'
      ).subscribe({
          next: user => {
            this.user$ = of(user);
          },
          error: err => console.log(err),
        });
    }
  }
  async delete() {
    const decision = await this.alertService.confirm('Are you sure?');
    if (decision) {
      this.util.wrapRequest(this.auth.logout(true))
      .subscribe({
        complete: () => {
          this.router.navigate(['/auth']);
        },
      });
    }
  }
}
