import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '@lajf-app/core/services';
import { DeclarationService } from '@lajf-app/health/services';
import { ModalController } from '@ionic/angular';
import { Declaration } from '@lajf-app/health/models';

@Component({
  selector: 'app-declare-modal',
  templateUrl: './declare-modal.component.html',
  styleUrls: ['./declare-modal.component.scss'],
})
export class DeclareModalComponent implements OnInit {

  public declareForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private declarationService: DeclarationService,
    private util: UtilService,
    private modalController: ModalController,
  ) {
    this.declareForm = this.formBuilder.group({
      question_1: [null, null],
      question_2: [null, null],
      question_3: [null, null],
      temperature: [null, Validators.required],
      share: [null, null],
    });
   }

  dismiss(declaration: Declaration = null) {
    this.modalController.dismiss(declaration);
  }
  ngOnInit() {}

  declare(form: FormGroup): void {
    if (form.valid) {
      this.util.wrapRequest(this.declarationService.create(form.value))
        .subscribe({
            next: declaration => this.dismiss(declaration),
            error: err => console.log(err),
          });
    }
  }
}
