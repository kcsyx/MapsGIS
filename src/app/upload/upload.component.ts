import { Component, OnInit } from '@angular/core';
import { GeojsonService } from '../services/geojson.service';
import GeoJson from '../models/geojson';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file: any;
  fileExists = undefined;
  fileName: string = undefined;

  constructor(private geoJsonService: GeojsonService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  saveGeoJson(dataName, geoJson) {
    let postData = {dataName, geoJson};
    this.geoJsonService.create(postData);
    // this.geoJsonService.create(dataName, geoJson)
    // .then(() => {
    //   console.log('Posted new GeoJson object successfully!');
    // });
  }

  fileChanged(e) {
    this.file = e.target.files[0];
    console.log(this.file);
    //CHECK IF FILE IS GEOJSON
    if (this.file.name.substr(this.file.name.length - 8) == ".geojson") {
      this.fileExists = 1;
    } else if (this.file.name.substr(this.file.name.length - 4) == ".shp") {
      //CONVERT SHP TO GEOJSON, USE DIFFERENT SUBMIT BUTTON TO UPLOAD LOCAL GEOJSON
      this.fileExists = 1;



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

      //Bandaid solution to have duplicate filenames uploaded, need to relook later
      let uploadedDataName = this.fileName+"_"+Date.now();
      this.saveGeoJson(uploadedDataName, jsonObj);
    }
    fileReader.readAsText(this.file);
  }
}
