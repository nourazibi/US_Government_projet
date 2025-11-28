import { Bar } from "react-chartjs-2";

export default function TimeRiskChart({ data }) {
  if (!data || data.length === 0) return <p>Chargement…</p>;

  const chartData = {
    labels: data.map(d => d.hour),
    datasets: [
      {
        label: "Risque criminel",
        data: data.map(d => d.risk),
        backgroundColor: "orange"
      }
    ]
  };

  return (
    <div>
      <h3>Heures les plus risquées</h3>
      <Bar data={chartData} />
    </div>
  );
}
