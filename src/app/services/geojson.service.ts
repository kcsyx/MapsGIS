import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import GeoJson from '../models/geojson';

@Injectable({
  providedIn: 'root'
})
export class GeojsonService {

  private dbPath = '/geojson';

  geoJsonRef: AngularFireList<GeoJson> = null;

  constructor(private db: AngularFireDatabase) {
    this.geoJsonRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<GeoJson> {
    return this.geoJsonRef;
  }

  create(geoJson: GeoJson): any {
    return this.geoJsonRef.push(geoJson);
  }

  delete(key: string): Promise<void> {
    return this.geoJsonRef.remove(key);
  }

}
