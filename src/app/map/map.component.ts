import { environment } from '../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
import { GeojsonService } from '../services/geojson.service';
import { map } from 'rxjs/operators';
import { ResourceLoader } from '@angular/compiler';

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

    // Add source and layers
    // this.map.on('load', () => {
    //   this.map.addSource('demoSource', {
    //     type: 'geojson',
    //     data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
    //   });
    //   this.map.addLayer({
    //     'id': 'demoLayer',
    //     'source': 'demoSource',
    //     'type': 'circle',
    //     'paint': {
    //       'circle-radius': 8,
    //       'circle-stroke-width': 2,
    //       'circle-color': 'red',
    //       'circle-stroke-color': 'white'
    //     }
    //   });
    // });
    this.retrieveData();
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
        console.log(e);
        //Turn retrieved data into map Data Source and Layers


      });

      // for (var i = 0; i < this.toggleableLayerIds.length; i++) {
      //   var id = this.toggleableLayerIds[i];
      //   var subMenu = document.createElement('div');
      //   var link = document.createElement('button');
      //   var deleteButton = document.createElement('button');
      //   deleteButton.textContent = 'Delete';
      //   subMenu.className = 'subMenu';
      //   link.className = 'active';
      //   link.textContent = id;
      //   link.onclick = () => {
      //     var clickedLayer = link.textContent;
      //     var visibility = this.map.getLayoutProperty(clickedLayer, 'visibility');
      //     if (visibility === 'visible') {
      //       this.map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      //       link.className = '';
      //     } else {
      //       link.className = 'active';
      //       this.map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      //     };
      //   };
      //   var layers = document.getElementById('menu');
      //   layers.appendChild(subMenu);
      //   subMenu.append(link);
      //   subMenu.appendChild(deleteButton);
      //   deleteButton.onclick = () => {
      //     console.log("Deleted" + id);

      //   }
      // };
    });
  }

  toggleVisibility(key) {
    var visibility = this.map.getLayoutProperty(key, 'visibility');
    if (visibility === 'visible') {
      this.map.setLayoutProperty(key, 'visibility', 'none');
    } else {
      this.map.setLayoutProperty(key, 'visibility', 'visible');
    };
  }

  deleteData(key) {
    this.geoJsonService.delete(key).then(() => {
      console.log('Deleted' + key);
    }).catch(err => console.log(err));
  }
}
