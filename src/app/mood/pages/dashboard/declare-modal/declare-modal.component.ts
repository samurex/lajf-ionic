import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, ToastService } from '@lajf-app/core/services';
import { DeclarationService, MoodService } from '@lajf-app/mood/services';
import { ModalController } from '@ionic/angular';
import { Declaration, Mood } from '@lajf-app/mood/models';

import { Plugins, GeolocationPosition } from '@capacitor/core';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-declare-modal',
  templateUrl: './declare-modal.component.html',
  styleUrls: ['./declare-modal.component.scss'],
})
export class DeclareModalComponent implements OnInit {
  private moods$: Observable<Mood[]>;
  private position: Promise<GeolocationPosition>;
  public declareForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private declarationService: DeclarationService,
    private util: UtilService,
    private modalController: ModalController,
    private toast: ToastService,
    private moodService: MoodService,
  ) {
    this.declareForm = this.formBuilder.group({
      mood_id: [null, Validators.required],
      scale: [null, Validators.required],
      feelings: [null, Validators.required],
      share: [false, null],
    });
   }

  dismiss(declaration: Declaration = null) {
    return this.modalController.dismiss(declaration);
  }

  ngOnInit() {
    this.position = Geolocation.getCurrentPosition();
    this.moods$ = this.moodService.get();
  }

  declare(form: FormGroup): void {
    if (form.valid) {
      this.util.wrapRequest(
          from(this.position),
          () => 'Unable to get device location',
          null,
          'Waiting for GPS'
      ).pipe(
        map(position => ({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
         })
        ),
        mergeMap(position => {
          return this.util.wrapRequest(
            this.declarationService.create({ ...form.value, ...position })
          );
        }),
      ).subscribe({
        next: declaration => this.dismiss(declaration),
        error: err => console.log(err),
      });
    }
  }
}
