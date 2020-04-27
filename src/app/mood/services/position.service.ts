import { Injectable } from '@angular/core';
import { Position } from '@lajf-app/mood/models';
import { Observable, from } from 'rxjs';
import { publishReplay, refCount, map } from 'rxjs/operators';

import { Plugins, GeolocationPosition } from '@capacitor/core';
const { Geolocation } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class PositionService {

  public position$: Observable<Position>;

  constructor() {
    this.position$ = this.getPosition();
  }

  private getPosition(): Observable<Position> {
    return from(Geolocation.getCurrentPosition())
      .pipe(
        map((pos: GeolocationPosition) => ({
          latitude: pos.coords.latitude,
          longitude: pos.coords.latitude,
        })),
        publishReplay<Position>(),
        refCount()
      );
  }
}
