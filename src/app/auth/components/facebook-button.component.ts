import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'trica-facebook-button',
  template: `
    <div class="social-auth ion-padding">
      <ion-button class="facebook" expand="block" (click)="click.emit($event)">
      <ion-icon slot="start" name="logo-facebook"></ion-icon>
      {{ 'AUTH.login.facebook' | translate }}
      </ion-button>
    </div>
  `,
  styles: [`.social-auth { background: var(--ion-color-light);}`]
})
export class FacebookButtonComponent implements OnInit {
  @Output() click = new EventEmitter<MouseEvent>();

  constructor() { }

  ngOnInit() {}
}
