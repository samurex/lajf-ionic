import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UtilService } from '@lajf-app/core/services';
import { AuthService } from '@lajf-app/auth/services';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public age: number;
  public registerForm: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private util: UtilService,
  ) {
    this.registerForm = this.formBuilder.group({
      age: [null, Validators.required],
      gender: [null, Validators.required],
      occupation:  [null, null]
    });
   }

  ngOnInit() {}

  register(form: FormGroup): void {
    if (form.valid) {
      this.util.wrapRequest(this.auth.register(form.value))
        .subscribe({
          next: _ => this.router.navigateByUrl('/mood'),
          error: err => console.log(err),
        });
    }
  }
}
