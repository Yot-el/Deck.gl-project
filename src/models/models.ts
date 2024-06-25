export interface ICoordinates {
  longitude: number | null;
  latitude: number | null;
}

export interface IWeather {
  description: string;
  temp: number;
  feelsLike: number;
  windSpeed: number;
}