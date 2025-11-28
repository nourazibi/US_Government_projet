import React from "react";
import "./App.css";
import EvolutionPage from "./pages/EvolutionPage";
import TypesPage from "./pages/TypesPage";
import HotspotsPage from "./pages/HotspotsPage";
import AnomaliesPage from "./pages/AnomaliesPage";

function App() {
  return (
    <div className="App">
      <h1>Analyse des Crimes aux États-Unis</h1>
      <EvolutionPage />
      <AnomaliesPage />
      <HotspotsPage />
      <TypesPage />
    </div>
  );
}

export default App;
