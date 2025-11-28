import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getAnomalies } from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// REGISTER scales, elements and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnomaliesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
  getAnomalies()
    .then((res) => {
      // Transformer l'objet en tableau
      const arr = Object.entries(res).map(([year, rate]) => ({
        Year: year,
        Violent_Rate: rate,
      }));
      setData(arr);
    })
    .catch(() => setData([]));
}, []);


  const chartData = {
    labels: data.map((d) => d.Year),
    datasets: [
      {
        label: "Violent Rate",
        data: data.map((d) => d.Violent_Rate),
        borderColor: "red",
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
}
