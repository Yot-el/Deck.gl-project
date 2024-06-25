import WeatherStore from "stores/WeatherStore";
import * as classes from "./WeatherPanel.module.css";
import { observer } from "mobx-react-lite";

const WeatherPanel = observer(() => {
  const { weather, isLoading } = WeatherStore;

  console.log(weather, isLoading);

  if (!weather) {
    return (
      <div className={classes["panel"]}>
        <h1 className={classes["title"]}>
          Погода
        </h1>
        <p className={classes["text"]}>
          Выберите точку на карте
        </p>
      </div>
    )
  }

  return (
    <div className={classes["panel"]}>
      <h1 className={classes["title"]}>
        Погода
      </h1>
      {
        !isLoading ?
        (
          <>
            <div className={classes["weather-container"]}>
              <h2 className={classes["weather-title"]}>
                { weather?.description }
              </h2>
            </div>
            <div className={classes["temp-container"]}>
              <p className={classes["text"]}>
                Температура: <span className={classes["weather-property"]}>{ weather?.temp } &#8451;</span>
              </p>
              <p className={classes["text"]}>
                Ощущается как <span className={classes["weather-property"]}>{ weather?.feelsLike } &#8451;</span>
              </p>
              <p className={classes["text"]}>
                Ветер <span className={classes["weather-property"]}>{ weather?.windSpeed } м/с</span>
              </p>
            </div>
          </>
        )
        :
        <div className={classes["loading-icon"]}>
          <svg className={classes["icon"]} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M2.501 8a5.5 5.5 0 1 1 5.5 5.5A.75.75 0 0 0 8 15a7 7 0 1 0-7-7a.75.75 0 0 0 1.501 0"/></svg>
        </div>
      }
    </div> 
  )
});

export default WeatherPanel;