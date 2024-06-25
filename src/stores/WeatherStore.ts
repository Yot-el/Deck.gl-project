import { makeAutoObservable, runInAction } from "mobx";
import { ICoordinates, IWeather } from "models/models";
import { fetchWeatherData } from "utils/api";

class WeatherStore {
  weather: IWeather | null = null
  isLoading = false

  constructor() {
    makeAutoObservable(this);
  }

  updateWeather = async (coordinates: ICoordinates) => {
    this.isLoading = true;

    try {
      const newWeather = await fetchWeatherData(coordinates);

      runInAction(() => {
        console.log(newWeather);
        this.weather = newWeather;
        this.isLoading = false;
      })
  
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw e;
      }
    }
  }
}

export default new WeatherStore();