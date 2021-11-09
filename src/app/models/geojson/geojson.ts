export default class GeoJson {
  type: string;
  geometry: {
    type: string,
    coordinates: Array<number>,
  };
  properties: {
    name: string,
  }
}
