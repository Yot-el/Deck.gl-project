import { COORDINATE_SYSTEM, Deck, DeckProps, SimpleMeshLayer, _GlobeView } from "deck.gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapView, MapViewState, PickingInfo} from "deck.gl";
import { useEffect, useRef, useState } from "react";
import { SphereGeometry } from '@luma.gl/engine';
import YandexMap from "components/YandexMap/YandexMap";

import * as classes from "./Map.module.css";
import { observer } from "mobx-react-lite";
import WeatherStore from "stores/WeatherStore";

const AIR_PORTS = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";
const LAND = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.geojson";

const Map = observer(() => {
  const { updateWeather } = WeatherStore;
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 5
  });

  const [deck, setDeck] = useState<Deck<(MapView | _GlobeView)[]> | null>(null);
  const deckContainer = useRef<HTMLDivElement | null>(null);
  const deckCanvas = useRef<HTMLCanvasElement | null>(null);

  const initDeck = () => {
    const views = [
      new MapView({
        id: "main",
        controller: true,
      }),
      new _GlobeView({
        id: "globe",
        x: "80%",
        y: 10,
        width: 300,
        height: 300,
      })
    ];

    const layers = [
      new SimpleMeshLayer({
        id: "globeBackground",
        data: [0],
        mesh: new SphereGeometry({ radius: 6.3e6, nlat: 18, nlong: 36 }),
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        getPosition: [0, 0, 0],
        getColor: [146, 194, 255],
      }),
      new GeoJsonLayer({
        id: "globeContinents",
        data: LAND,
        filled: true,
        // Need this to remove z-fighting in globeView
        getPolygonOffset: ({ layerIndex }) => [-1, -layerIndex * 100],
        getFillColor: [255, 255, 255, 180],
      }),
      new GeoJsonLayer({
        id: "airports",
        data: AIR_PORTS,
        filled: true,
        pointRadiusMinPixels: 2,
        pointRadiusScale: 2000,
        getPointRadius: f => 11 - f.properties.scalerank,
        getFillColor: [200, 0, 80, 180],
        pickable: true,
        autoHighlight: true,
        // Need this to remove z-fighting in globeView
        getPolygonOffset: ({ layerIndex }) => [-2, -layerIndex * 100],
      })
    ]

    const layerFilter: DeckProps["layerFilter"] = ({ layer, viewport, isPicking }) => {
      if (viewport.id !== "globe" && (layer.id === "globeContinents" || layer.id === "globeBackground")) {
        return false;
      }

      if (isPicking && viewport.id === "globe") {
        return false;
      }

      return true;
    }

    const newDeck = new Deck({
      canvas: deckCanvas.current,
      parent: deckContainer.current,
      viewState: {
        main: {
          ...viewState,
          zoom: viewState.zoom - 1
        },
        globe: {
          ...viewState,
          zoom: -1
        }
      },
      layers: layers,
      layerFilter: layerFilter,
      views: views,
      pickingRadius: 5,
      getTooltip: getTooltip,
      onClick: onDeckClick
    });

    setDeck((prevDeck) => {
      prevDeck?.finalize();
      return newDeck;
    }
    );
  };

  useEffect(() => {
    initDeck();

    return () => {
      deck?.finalize();
    }
  }, [])

  useEffect(() => {
    deck?.setProps({
      viewState: {
        main: {
          ...viewState,
          zoom: viewState.zoom - 1
        },
        globe: {
          ...viewState,
          zoom: -1
        }
      }
    })
  }, [viewState])

  const onDeckClick = (info: PickingInfo) => {
    if (info.coordinate) {
      const coordinates = {
        longitude: info.coordinate[0],
        latitude: info.coordinate[1],
      }

      updateWeather(coordinates);
    }
  };

  const getTooltip = (info: PickingInfo) => {
    if (info.object) {
      return info.object.properties.name;
    }
  }

  return (
    <>
      <div ref={deckContainer} className={classes["deck-container"]}>
        <YandexMap setViewState={setViewState}/>
        <canvas ref={deckCanvas} style={{pointerEvents: "none"}}></canvas>
      </div>
    </>
  )
})

export default Map;