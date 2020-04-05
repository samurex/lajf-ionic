import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '@lajf-app/core/services';
import { DeclarationService } from '@lajf-app/health/services';

@Component({
  selector: 'app-declare',
  templateUrl: './declare.page.html',
  styleUrls: ['./declare.page.scss'],
})
export class DeclarePage implements OnInit {

  public declareForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private declarationService: DeclarationService,
    private util: UtilService,
  ) {
    this.declareForm = this.formBuilder.group({
      question_1: [null, null],
      question_2: [null, null],
      question_3: [null, null],
      temperature: [null, Validators.required],
      share: [null, null],
    });
   }

  ngOnInit() {}

  declare(form: FormGroup): void {
    console.log('declare', form.value);
    if (form.valid) {
      this.util.wrapRequest(this.declarationService.create(form.value), null,
        _ => 'Welcome!'
      ).subscribe({
          next: _ => this.router.navigateByUrl('/user'),
          error: err => console.log(err),
        });
    }
  }

}
