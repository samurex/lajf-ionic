import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { mergeMap, catchError, map, tap } from 'rxjs/operators';
import { Plugins, GeolocationPosition, CameraResultType, CameraSource } from '@capacitor/core';

import { UtilService, ToastService } from '@lajf-app/core/services';
import { DeclarationService, MoodService, UploadService } from '@lajf-app/mood/services';
import { Declaration, Mood } from '@lajf-app/mood/models';


const { Geolocation, Camera } = Plugins;


@Component({
  selector: 'app-declare-modal',
  templateUrl: './declare-modal.component.html',
  styleUrls: ['./declare-modal.component.scss'],
})
export class DeclareModalComponent implements OnInit {
  public photo: SafeResourceUrl;
  private uploadPromise: Promise<{id: number }> = Promise.resolve(null);

  public moods$: Observable<Mood[]>;
  private position: Promise<GeolocationPosition>;
  public declareForm: FormGroup;
  MAX_LENGTH = 300;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private declarationService: DeclarationService,
    private util: UtilService,
    private modalController: ModalController,
    private toast: ToastService,
    private moodService: MoodService,
    private uploadService: UploadService
  ) {

    this.declareForm = this.formBuilder.group({
      mood_id: [null, Validators.required],
      scale: [null, Validators.required],
      feelings: ['', Validators.maxLength(this.MAX_LENGTH)],
      image_id: [null, null],
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

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    this.photo = image.dataUrl;
    this.uploadPromise = this.uploadService.upload(image.dataUrl).toPromise();
  }

  declare(form: FormGroup): void {
    if (form.valid) {
      from(this.uploadPromise)
        .pipe(
          tap(image => {
            if (image) {
              form.patchValue({ image_id: image.id });
            }
          }),
          mergeMap(_ => this.util.wrapRequest(
            from(this.position),
            () => 'Unable to get device location',
            null,
            'Waiting for GPS'
          )),
          map(position => ({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })),
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
