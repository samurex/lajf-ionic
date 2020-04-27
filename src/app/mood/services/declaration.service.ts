import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Declaration, Hashtag, Position } from '@lajf-app/mood/models';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {

  constructor(private http: HttpClient) { }

  public create(declaration: Declaration) {
    return this.http.post<Declaration>('declare', { ...declaration });
  }

  public latest() {
      return this.http.get<Declaration>('latest');
  }

  public map() {
    return this.http.get<Declaration[]>('map');
  }

  public dashboard(position: Position, hashtag: Hashtag) {
    const latitude = position ? position.latitude : '';
    const longitude = position ? position.longitude : '';
    const hashtagId = hashtag ? hashtag.id : '';
    const url = `dashboard?latitude=${latitude}&longitude=${longitude}&hashtag_id=${hashtagId}`;

    return this.http.get<Declaration[]>(url);
  }
}
