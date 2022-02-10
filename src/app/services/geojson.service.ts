import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import GeoJson from '../models/geojson';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class GeojsonService {

  private dbPath = '/geojson';

  geoJsonRef: AngularFireList<GeoJson> = null;

  constructor(private db: AngularFireDatabase, private http: HttpClient,) {
    this.geoJsonRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<GeoJson> {
    return this.geoJsonRef;
  }

  create(postData: { dataName: string, geoJson: any }) {
    const url = environment.firebaseConfig.databaseURL + '/geojson/' + postData.dataName + '.json';
    this.http.put(url, postData.geoJson).subscribe(responseData => { console.log('Posted successfully' + responseData) });
  }

  delete(key: string): Observable<any> {
    const url = environment.firebaseConfig.databaseURL + '/geojson/' + key + '.json';
    return this.http.delete(url);
  }

  download(fileName, keyValue) {
    let file = JSON.stringify(keyValue);
    let blob = new Blob([file], { type: "application/JSON" });
    FileSaver.saveAs(blob, fileName + ".geojson");
  }
}
