import React from "react";

export default function StateSelector({ states, selectedState, onChange }) {
  return (
    <select value={selectedState} onChange={(e) => onChange(e.target.value)}>
      <option value="">-- Sélectionner un État --</option>
      {states.map((state, idx) => (
        <option key={idx} value={state}>
          {state}
        </option>
      ))}
    </select>
  );
}
