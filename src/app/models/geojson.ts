export default class GeoJson {
  type: string;
  features: [{
    geometry: {
      type: string;
      coordinates: Array<number>;
    },
    properties: {
      x: number;
      group: number;
    },
    type: string
  }];
}
