import { useEffect, useState } from "react";
import { getRisk } from "../api";
import TimeRiskChart from "../components/TimeRiskChart";

export default function RiskPage() {
  const [data, setData] = useState([]);
  useEffect(() => { getRisk().then(setData); }, []);

  return (
    <div>
      <h2>Heures les Plus Risquées</h2>
      <TimeRiskChart data={data} />
    </div>
  );
}
