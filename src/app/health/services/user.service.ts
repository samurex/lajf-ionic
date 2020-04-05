import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@lajf-app/health/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public get() {
    return this.http.get<User>('me');
  }
}
