import { environment } from '../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
import { GeojsonService } from '../services/geojson.service';
import { map } from 'rxjs/operators';

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
  retrievedData: any;
  toggleableLayerIds = new Array;
  public selectedIndex;

  constructor(private geoJsonService: GeojsonService) { }

  ngOnInit() {
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
    this.map.on('load', () => {
      this.retrieveData();
    });
  }

  // Toggle Data visibility and retrieve data from firebase
  retrieveData() {
    this.geoJsonService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.retrievedData = data;
      this.retrievedData.forEach(e => {
        this.toggleableLayerIds.push(e.key);
        //Turn retrieved data into map Data Source and Layers
        this.map.addSource(e.key, {
          type: 'geojson',
          data: {
            "type": e.type,
            "features": e.features
          }
        });
        this.map.addLayer({
          'id': e.key,
          'type': 'fill',
          'source': e.key,
          'paint': {
            'fill-color': e.layerColor,
            'fill-opacity': 0.4
          },
          'filter': ['==', '$type', 'Polygon'],
          'layout': {
            // Make the layer visible by default.
            'visibility': 'visible'
          },
        });
        this.map.addLayer({
          'id': e.key + 'Point',
          'type': 'circle',
          'source': e.key,
          'paint': {
            'circle-radius': 4,
            'circle-color': e.layerColor,
          },
          'filter': ['==', '$type', 'Point'],
          'layout': {
            // Make the layer visible by default.
            'visibility': 'visible'
          },
        });
        this.map.addLayer({
          'id': e.key + 'Line',
          'type': 'line',
          'source': e.key,
          'paint': {
            'line-color': e.layerColor,
            'line-width': 2
          },
          'filter': ['==', '$type', 'LineString'],
          'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            // Make the layer visible by default.
            'visibility': 'visible'
          },
        });

        // Create a popup, but don't add it to the map yet.
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        //Map layer hover

        this.map.on('mouseenter', e.key, (f) => {
          this.map.getCanvas().style.cursor = 'pointer';
          // Populate the popup and set its coordinates based on the feature found.
          popup.setLngLat(f.lngLat).setHTML(e.key).addTo(this.map);
        });
        this.map.on('mouseenter', e.key + 'Point', (f) => {
          this.map.getCanvas().style.cursor = 'pointer';
          // Populate the popup and set its coordinates based on the feature found.
          popup.setLngLat(f.lngLat).setHTML(e.key).addTo(this.map);
        });
        this.map.on('mouseenter', e.key + 'Line', (f) => {
          this.map.getCanvas().style.cursor = 'pointer';
          // Populate the popup and set its coordinates based on the feature found.
          popup.setLngLat(f.lngLat).setHTML(e.key).addTo(this.map);
        });
        this.map.on('mouseleave', e.key, () => {
          this.map.getCanvas().style.cursor = '';
          popup.remove();
        });
        this.map.on('mouseleave', e.key + 'Point', () => {
          this.map.getCanvas().style.cursor = '';
          popup.remove();
        });
        this.map.on('mouseleave', e.key + 'Line', () => {
          this.map.getCanvas().style.cursor = '';
          popup.remove();
        });

      });
    });
  }

  toggleVisibility(key, i) {
    var visibility = this.map.getLayoutProperty(key, 'visibility');
    if (visibility === 'visible') {
      this.selectedIndex = i;
      this.map.setLayoutProperty(key, 'visibility', 'none');
      this.map.setLayoutProperty(key + 'Point', 'visibility', 'none');
      this.map.setLayoutProperty(key + 'Line', 'visibility', 'none');
    } else {
      this.selectedIndex = undefined;
      this.map.setLayoutProperty(key, 'visibility', 'visible');
      this.map.setLayoutProperty(key + 'Point', 'visibility', 'visible');
      this.map.setLayoutProperty(key + 'Line', 'visibility', 'visible');
    };
  }

  deleteData(key) {
    this.geoJsonService.delete(key).subscribe(() => {
      console.log('Deleted' + key);
      //Remove source and layers
      this.map.removeLayer(key);
      this.map.removeLayer(key + 'Point');
      this.map.removeLayer(key + 'Line');
      this.map.removeSource(key);
    });
  }
}
