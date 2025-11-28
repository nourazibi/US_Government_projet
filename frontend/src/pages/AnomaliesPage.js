import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getSmartAnomalies } from "../api";
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

export default function AnomaliesPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getSmartAnomalies().then(res => {
      // Trier par année
      const sorted = res.sort((a, b) => a.Year - b.Year);
      setData(sorted);
    });
  }, []);

  if (!data.length) return <p>Chargement...</p>;

  const chartData = {
    labels: data.map(d => d.Year),
    datasets: [
      {
        label: "Taux Violent",
        data: data.map(d => d.Violent_Rate),
        borderColor: "blue",
        fill: false,
        tension: 0.3
      },
      {
        label: "Variation brute",
        data: data.map(d => d.Change),
        borderColor: "red",
        fill: false,
        tension: 0.3,
        yAxisID: "y1"
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    stacked: false,
    plugins: {
      title: { display: true, text: "Anomalies détectées (Variation brutale)" },
      tooltip: { mode: "index", intersect: false }
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Taux Violent" }
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Variation brute" },
        grid: { drawOnChartArea: false }
      },
      x: {
        title: { display: true, text: "Année" },
        ticks: {
          autoSkip: false, // affiche chaque année
          maxRotation: 90,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div>
      <h2>Anomalies détectées (Variation brutale)</h2>
      <div style={{ maxWidth: 900, marginBottom: 30 }}>
        <Line data={chartData} options={options} />
      </div>

      <table border="1" style={{ borderCollapse: "collapse", marginTop: 10 }}>
        <thead>
          <tr>
            <th>Année</th>
            <th>Taux Violent</th>
            <th>Variation brute</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.Year}</td>
              <td>{row.Violent_Rate.toFixed(2)}</td>
              <td style={{ color: row.Change > 0 ? "red" : "green" }}>
                {row.Change.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
