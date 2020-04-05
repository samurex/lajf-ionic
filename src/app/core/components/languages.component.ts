import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Language } from '@lajf-app/core/models';

@Component({
  selector: 'trica-languages',
  template: `
    <a *ngFor="let language of languages"
        [attr.data-desc]="language.name"
        [attr.color]="language.code === selected?.code ? 'primary' : ''" (click)="languageChange.emit(language)" class="language">
            <img src="assets/{{ language.code }}.png" [attr.class]="language.code === selected?.code ? 'selected' : ''">
    </a>
    `,
  styles: [`.social-auth { background: var(--ion-color-light);}`]
})
export class LanguagesComponent implements OnInit {
  @Input() selected: Language;
  @Input() languages: Language[];
  @Output() languageChange = new EventEmitter<Language>();

  constructor() {
  }

  ngOnInit() {
  }
}
