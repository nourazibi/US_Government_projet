import React, { useEffect, useState } from "react";
import { getAnomalies } from "../api";

export default function AnomaliesTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAnomalies()
      .then(res => setData(res))
      .catch(() => setData([]));
  }, []);

  if (!data.length) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Anomalies détectées (Méthode classique)</h2>
      <ul>
        {data.map((row, index) => (
          <li key={index}>
            {row.Year}: {row.Violent_Rate.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
