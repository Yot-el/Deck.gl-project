import { ICoordinates, IWeather } from "models/models";

const WEATHER_API_KEY = process.env.WEATHER_TOKEN ?? "";

export const fetchWeatherData = async (coordinates: ICoordinates): Promise<IWeather> => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates?.latitude}&lon=${coordinates?.longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`;

  if (!WEATHER_API_KEY) {
    throw new Error("No API key")
  }

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`${response.status} API error`);
    }

    const data = await response.json();

    const weather = {
      description: data.weather[0].description,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      windSpeed: data.wind.speed,
    }

    return weather;

  } catch (e: unknown) {
    throw e;
  }
}