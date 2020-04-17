import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mood } from '@lajf-app/mood/models';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  constructor(private http: HttpClient) { }

  public get() {
    return this.http.get<Mood[]>('moods');
  }
}
