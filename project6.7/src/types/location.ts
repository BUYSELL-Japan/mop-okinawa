export interface Location {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: string;
    title: string;
    description: string;
    address: string;
    map_id: string;
    pic: string;
    category: string;
    category_id?: string;
    pin_id?: string;
    original_data?: {
      category: string;
      [key: string]: any;
    };
  };
}

export interface GeoJSONData {
  type: 'FeatureCollection';
  features: Location[];
}

export const CATEGORIES: Record<string, {
  name: string;
  color: string;
  markerUrl: string;
}> = {
  "1": {
    name: "Tourist Attractions",
    color: "#ff0000",
    markerUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
  },
  "2": {
    name: "Activity",
    color: "#00ff00",
    markerUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
  },
  "3": {
    name: "Hotels",
    color: "#e3f26f",
    markerUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png"
  },
  "4": {
    name: "Restaurant",
    color: "#ff9933",
    markerUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png"
  },
  "5": {
    name: "Beaches",
    color: "#00ffff",
    markerUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png"
  },
  "6": {
    name: "Hospitals",
    color: "#ffffff",
    markerUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png"
  },
  "9": {
    name: "Naha Airport",
    color: "#8000ff",
    markerUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png"
  }
};