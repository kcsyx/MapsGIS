import { Component, OnInit } from '@angular/core';
import { GeojsonService } from '../services/geojson.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import shp from 'shpjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file: any;
  fileExists = undefined;
  fileName: string = undefined;
  layerColor: string = "#c05959";
  shpZipFile = undefined;
  convertedGeoJson: any;

  constructor(private geoJsonService: GeojsonService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  mapPage() {
    this.router.navigate(['/index'])
      .then(() => {
        window.location.reload();
      });
  }

  saveGeoJson(dataName, geoJson) {
    let postData = { dataName, geoJson };
    this.geoJsonService.create(postData);
    // this.geoJsonService.create(dataName, geoJson)
    // .then(() => {
    //   console.log('Posted new GeoJson object successfully!');
    // });
  }

  fileChanged(e) {
    this.fileExists = undefined;
    this.shpZipFile = undefined;
    this.file = e.target.files[0];
    console.log(this.file);
    //CHECK IF FILE IS GEOJSON
    if (this.file.name.substr(this.file.name.length - 8) == ".geojson") {
      this.fileExists = 1;
    } else if (this.file.name.substr(this.file.name.length - 4) == ".zip") {
      //CONVERT SHP TO GEOJSON
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.file);
      fileReader.onload = (e) => {
        var arrayBuffer: ArrayBuffer = fileReader.result as ArrayBuffer;
        if (arrayBuffer) {
          let buffer: any = Buffer.from(arrayBuffer);
          shp(buffer).then((geojson) => {
            this.convertedGeoJson = geojson;
            this.shpZipFile = 1;
          });
        };
      };
    } else {
      this.fileExists = undefined;
      alert("Upload only GEOJSON or SHP files");
    }
  }

  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      let jsonObj = (JSON.parse(fileReader.result.toString()));
      jsonObj["layerColor"] = this.layerColor;
      //Bandaid solution to have duplicate filenames uploaded, need to relook later
      let uploadedDataName = this.fileName + "_" + Date.now();
      this.saveGeoJson(uploadedDataName, jsonObj);
      this.fileExists = undefined;
    }
    fileReader.readAsText(this.file);
  }

  convertUpload(geojson) {
    console.log(geojson)
    let jsonObj = geojson;
    jsonObj["layerColor"] = this.layerColor;
    //Bandaid solution to have duplicate filenames uploaded, need to relook later
    let uploadedDataName = this.fileName + "_" + Date.now();
    this.saveGeoJson(uploadedDataName, jsonObj);
    this.shpZipFile = undefined;
  }
}
