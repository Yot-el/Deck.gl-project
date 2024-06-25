import type { YMap, MapEventUpdateHandler } from "@yandex/ymaps3-types";
import { MapViewState } from "deck.gl";
import { memo, useEffect, useRef, useState } from "react";

import * as classes from "./YandexMap.module.css";

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 5
}

interface IYandexMapProps {
  setViewState: React.Dispatch<React.SetStateAction<MapViewState>>;
}

const YandexMap = memo(({ setViewState }: IYandexMapProps) => {
  const [yMap, setYMap] = useState<YMap | null>(null);
  const yMapContainer = useRef<HTMLDivElement | null>(null);

  const onUpdate: MapEventUpdateHandler = ({ location }) => {
    setViewState({
      longitude: location.center[0],
      latitude: location.center[1],
      zoom: location.zoom
    })
  }

  const initYMap = async () => {
    await ymaps3.ready;

    if (yMapContainer.current) {
      const map = new ymaps3.YMap(yMapContainer.current, {
        location: {
          center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
          zoom: INITIAL_VIEW_STATE.zoom
        },
        zoomRange: {
          min: 3,
          max: 10,
        }
      });

      setYMap((prevMap) => {
        prevMap?.destroy();
        return map;
      });
    }
  }

  useEffect(() => {
    initYMap();

    return () => {
      yMap?.destroy();
    }
  }, [])

  useEffect(() => {
    if (!yMap) {
      return;
    }

    const mapListener = new ymaps3.YMapListener({
      layer: "any",
      onUpdate: onUpdate
    })

    yMap?.addChild(mapListener);
    yMap?.addChild(new ymaps3.YMapDefaultSchemeLayer({}));

    return () => {
      yMap?.removeChild(mapListener);
    }

  }, [yMap])

  return (
    <div ref={yMapContainer} className={classes["y-map"]}></div>
  )
})

export default YandexMap;