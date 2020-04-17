import { Component, OnInit } from '@angular/core';
import { MAPBOX_TOKEN } from '@environments/environment';
import { Plugins, GeolocationPosition } from '@capacitor/core';
import { DeclarationService } from '@lajf-app/mood/services';
import { UtilService } from '@lajf-app/core/services';
import { from } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: mapboxgl.Map;

  constructor(private declarationService: DeclarationService, private util: UtilService) { }

  ionViewDidEnter() {
    this.map = new mapboxgl.Map({
      accessToken: MAPBOX_TOKEN,
      container: 'map',
      style:  'mapbox://styles/mapbox/streets-v11',
      zoom: 10,
      scrollZoom: false,
      center: new mapboxgl.LngLat(18.6466, 54.3520)
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    // current position
    Geolocation.getCurrentPosition()
      .then(({ coords }) => this.map.setCenter([coords.longitude, coords.latitude, ]));

    this.declarationService.map()
      .subscribe({
        next: decls => {
          decls.forEach(d => {
            console.log(d);
            new mapboxgl.Marker().setLngLat([d.longitude, d.latitude]).addTo(this.map);
          });
        }
      });
  }
  ngOnInit() {
  }
}
