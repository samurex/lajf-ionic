import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mood } from '@lajf-app/mood/models';
import { Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  public moods$: Observable<Mood[]> = this.http.get<Mood[]>('moods')
    .pipe(
      publishReplay(),
      refCount()
    );

  constructor(private http: HttpClient) {
  }
}
