import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Declaration } from '@lajf-app/health/models';

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
}
