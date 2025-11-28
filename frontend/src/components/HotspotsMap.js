import React, { useEffect, useState } from "react";
import { getHotspots } from "../api";
import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

// Fichier GeoJSON des US
const geoUrl =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function HotspotsMap() {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    getHotspots().then(data => setHotspots(data));
  }, []);

  if (!hotspots.length) return <p>Chargement...</p>;

  // Convertir en dictionnaire {State: Value}
  const hotspotData = {};
  hotspots.forEach(s => {
    hotspotData[s.State] = s.Violent_Rate;
  });

  // Trouver min/max pour un meilleur dégradé
  const values = Object.values(hotspotData);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);

  // Fonction couleur lisible
  const colorScale = (value) => {
    const ratio = (value - minV) / (maxV - minV);
    const red = Math.floor(255 * ratio);
    const green = Math.floor(200 * (1 - ratio));
    return `rgb(${red}, ${green}, 80)`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Carte des Hotspots (Taux Violent Crime)</h3>

      <ComposableMap
        projection="geoAlbersUsa"
        width={800}
        height={500}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const stateName = geo.properties.name;
              const val = hotspotData[stateName];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={val ? colorScale(val) : "#EEE"}
                  stroke="#333"
                  strokeWidth={0.5}
                  onMouseEnter={() => {
                    const tooltip = document.getElementById("hotspotTooltip");
                    tooltip.innerHTML = val
                      ? `${stateName}<br><b>${val}</b>`
                      : `${stateName}<br><i>Pas dans le Top 10</i>`;
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById("hotspotTooltip");
                    tooltip.innerHTML = "Survolez un État";
                  }}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#ffcc00", outline: "none" }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      <div
        id="hotspotTooltip"
        style={{
          marginTop: "10px",
          padding: "10px",
          background: "#222",
          color: "white",
          display: "inline-block",
          borderRadius: "8px"
        }}
      >
        Survolez un État
      </div>

      {/* Légende */}
      <div style={{ marginTop: "20px" }}>
        <h4>Légende</h4>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <div style={{ background: colorScale(minV), width: "40px", height: "20px" }}></div>
          <span>↔</span>
          <div style={{ background: colorScale(maxV), width: "40px", height: "20px" }}></div>
        </div>
        <p>{minV} (faible) — {maxV} (élevé)</p>
      </div>
    </div>
  );
}
