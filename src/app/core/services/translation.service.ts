import { Injectable } from '@angular/core';
import { Language } from '@lajf-app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, from } from 'rxjs';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English'},
  { code: 'sv', name: 'Svenska'},
];
const DEFAULT_LANGUAGE = LANGUAGES[0];

const STORAGE_KEY = 'lang';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private loadedSubject$ = new BehaviorSubject<boolean>(false);
  private languageSubject$ = new BehaviorSubject<Language>(null);

  constructor(
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang(DEFAULT_LANGUAGE.code);
  }

  public get languages() {
    return LANGUAGES;
  }

  public async setup() {
    const storageItem = await Storage.get({ key: STORAGE_KEY });
    const lang = JSON.parse(storageItem.value) || DEFAULT_LANGUAGE;
    await this.switchLanguage(lang);
    this.loadedSubject$.next(true);
  }

  public async switchLanguage(lang: Language) {
    await Storage.set({ key: STORAGE_KEY, value: JSON.stringify(lang) });
    this.translate.use(lang.code);
    this.languageSubject$.next(lang);
  }

  get loaded$() {
    return this.loadedSubject$.asObservable();
  }

  get lang$() {
    return this.languageSubject$.asObservable();
  }
}
