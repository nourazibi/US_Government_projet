import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getTypes } from "../api";

function TopBars() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getTypes().then(res => setData(res.data));
  }, []);

  if (!data) return <p>Chargement...</p>;

  const chartData = {
    labels: data.map(d => d.CrimeType),
    datasets: [
      {
        label: "Nombre de crimes",
        data: data.map(d => d.Count),
        backgroundColor: "orange"
      }
    ]
  };

  return <Bar data={chartData} />;
}

export default TopBars;
