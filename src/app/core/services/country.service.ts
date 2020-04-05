import { Injectable } from '@angular/core';
import { Country } from '@lajf-app/core/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CountryService {
  public countries$: Observable<Country[]>;

  constructor(private http: HttpClient) {
    this.countries$ = this.http.get<Country[]>('countries')
      .pipe(shareReplay());
  }
}
