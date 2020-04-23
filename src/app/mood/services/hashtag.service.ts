import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hashtag } from '@lajf-app/mood/models';

@Injectable({
  providedIn: 'root'
})
export class HashtagService {

  constructor(private http: HttpClient) { }

  public search(search: string) {
    return this.http.get<Hashtag[]>(`hashtags?search=${search}`);
  }
}
