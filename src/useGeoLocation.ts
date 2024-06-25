import { useEffect, useState } from "react";

export const useGeoLocation = () => {
  const [coordsState, setCoordsState] = useState<GeolocationCoordinates | null>(null);
  const geolocation = navigator.geolocation;

  useEffect(() => {
    geolocation.getCurrentPosition((position) => {
      setCoordsState(position.coords);
    });
  }, [])

  return coordsState;
}