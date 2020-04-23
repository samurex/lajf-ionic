import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Declaration } from '@lajf-app/mood/models';

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

  public dashboard({ latitude, longitude }: { latitude: number, longitude: number }) {
    return this.http.get<Declaration[]>(`dashboard?latitude=${latitude || ''}&longitude=${longitude || ''}`);
  }
}
