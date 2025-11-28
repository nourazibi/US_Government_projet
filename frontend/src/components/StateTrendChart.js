import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getStateEvolution } from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function StateTrendChart({ state }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!state) return;
    getStateEvolution(state)
      .then(res => setData(res))
      .catch(() => setData([]));
  }, [state]);

  if (!state) return <p>Veuillez sélectionner un État.</p>;
  if (!data.length) return <p>Chargement...</p>;

  const chartData = {
    labels: data.map(d => d.Year),
    datasets: [
      {
        label: "Property Rate",
        data: data.map(d => d.Property_Rate),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.3,
        fill: true
      },
      {
        label: "Violent Rate",
        data: data.map(d => d.Violent_Rate),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Tendance des Crimes dans ${state}`
      },
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} / 100k`
        }
      }
    },
    scales: {
      y: {
        title: { display: true, text: "Crimes pour 100 000 habitants" },
        ticks: { callback: val => val.toLocaleString() },
        grid: { color: "rgba(200,200,200,0.3)", borderDash: [5, 5] }
      },
      x: {
        title: { display: true, text: "Année" }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}
