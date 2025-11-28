import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getTypes } from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TypeTrendsAnimated() {
  const [data, setData] = useState({});
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    getTypes()
      .then((res) => setData(res))
      .catch(() => setData({}));
  }, []);

  // Animation: augmenter le nombre de barres visibles toutes les 500ms
  useEffect(() => {
    if (!Object.keys(data).length) return;
    if (visibleCount < Object.keys(data).length) {
      const timer = setTimeout(() => setVisibleCount(visibleCount + 1), 500);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, data]);

  if (!Object.keys(data).length) return <p>Chargement...</p>;

  const labels = Object.keys(data).map((label) =>
    label.replace("Data.Rates.", "").replace(/\./g, " ")
  );
  const values = Object.values(data).slice(0, visibleCount);

  const colors = values.map((v) =>
    v >= 0 ? "rgba(255, 99, 132, 0.7)" : "rgba(75, 192, 192, 0.7)"
  );

  const chartData = {
    labels: labels.slice(0, visibleCount),
    datasets: [
      {
        label: "Variation du taux",
        data: values,
        backgroundColor: colors,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Variation des types de crimes (positif = augmentation, négatif = diminution)",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Variation du taux" },
        beginAtZero: false,
      },
      x: {
        ticks: { maxRotation: 45, minRotation: 30 },
      },
    },
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
