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

  constructor(private geoJsonService: GeojsonService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  // saveGeoJson() {
  //   this.geoJsonService.create(this.file).then(() => {
  //     console.log('Posted new GeoJson object successfully!');
  //   });
  // }

  fileChanged(e) {
    this.file = e.target.files[0];
    console.log(this.file)
    //CHECK IF FILE IS JSON
    if (this.file.type == "application/json") {
      this.fileExists = 1;
    } else if (this.file.name.substr(this.file.name.length - 3) == "shp") {
      //CONVERT SHP TO JSON, USE DIFFERENT SUBMIT BUTTON TO UPLOAD LOCAL JSON
      this.fileExists = 1;
    } else {
      this.fileExists = undefined;
      alert("Upload only JSON or SHP files");
    }
  }

  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
    }
    fileReader.readAsText(this.file);
  }
}
