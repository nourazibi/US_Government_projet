import React, { useState, useEffect } from "react";
import UsaTrendChart from "../components/UsaTrendChart";
import StateSelector from "../components/StateSelector";
import StateTrendChart from "../components/StateTrendChart";
import axios from "axios";

export default function EvolutionPage() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    // Extraire tous les états depuis le backend
    axios.get("http://127.0.0.1:8000/trends/state-list")
      .then(res => setStates(res.data))
      .catch(() => setStates([]));
  }, []);

  return (
    <div>
      <h2>Tendance Nationale (Violent & Property Rate)</h2>
      <UsaTrendChart />

      <h2>Tendance par État</h2>
      <StateSelector
        states={states}
        selectedState={selectedState}
        onChange={setSelectedState}
      />
      <StateTrendChart state={selectedState} />
    </div>
  );
}
