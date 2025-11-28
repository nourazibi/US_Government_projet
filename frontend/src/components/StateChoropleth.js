// frontend/src/components/StateChoropleth.js
import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { getHotspots } from "../api";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function StateChoropleth({ selectedYear }) {
  const [stateData, setStateData] = useState({});

  useEffect(() => {
    if (!selectedYear) return;

    getHotspots(selectedYear)
      .then((data) => setStateData(data))
      .catch((err) => console.error(err));
  }, [selectedYear]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <h3>Hotspots – Carte des États</h3>

      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const crimeValue = stateData[stateName] || 0;

              const color =
                crimeValue > 600
                  ? "#800026"
                  : crimeValue > 500
                  ? "#BD0026"
                  : crimeValue > 400
                  ? "#E31A1C"
                  : crimeValue > 300
                  ? "#FC4E2A"
                  : crimeValue > 200
                  ? "#FD8D3C"
                  : "#FEB24C";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={color}
                  stroke="#FFF"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#00BFFF", outline: "none" },
                    pressed: { outline: "none" }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
