import { environment } from '../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  //map settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 1.346170;
  lng = 103.898630;
  // map data
  source: any;

  constructor() { }

  ngOnInit() {
    this.initialiseMap();
  }

  private initialiseMap() {
    // locate the user
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(position => {
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //     this.map.flyTo({
    //       center: [this.lng, this.lat]
    //     })
    //     // Add marker to center of map or user location after geolocating
    //     const marker = new mapboxgl.Marker()
    //       .setLngLat([this.lng, this.lat])
    //       .addTo(this.map);
    //   });
    // };

    this.buildMap();

  }

  buildMap() {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapbox.accessToken);
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    var directions = new MapboxDirections({
      accessToken: environment.mapbox.accessToken
    });
    this.map.addControl(directions, 'top-left');
    this.map.addControl(new MapboxTraffic());

    // Initialize the GeolocateControl.
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    // Add the control to the map.
    this.map.addControl(geolocate);
    // Set an event listener that fires when a geolocate event occurs.
    function success(pos) {
      directions.setOrigin([pos.coords.longitude, pos.coords.latitude]);
    }
    geolocate.on('geolocate', success);

    // Add source and layers
    this.map.on('load', () => {
      this.map.addSource('demoSource', {
        type: 'geojson',
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
      });
      this.map.addLayer({
        'id': 'demoLayer',
        'source': 'demoSource',
        'type': 'circle',
        'paint': {
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white'
        }
      });
    });

    // Toggle data layer visiblity
    var link = document.createElement('button');
    link.className = 'active';
    link.textContent = 'Toggle demoLayer';

    link.onclick = () => {
      var visibility = this.map.getLayoutProperty('demoLayer', 'visibility');

      if (visibility === 'visible') {
        this.map.setLayoutProperty('demoLayer', 'visibility', 'none');
        link.className = '';
      } else {
        link.className = 'active';
        this.map.setLayoutProperty('demoLayer', 'visibility', 'visible');
      };
    };
    var layers = document.getElementById('menu');
    layers.appendChild(link);
  }
}
