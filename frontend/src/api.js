import axios from "axios";

// URL de base de ton backend FastAPI
const API = "http://127.0.0.1:8000";

// Tendances nationales (Property & Violent Rate)
export const getUSAEvolution = async () => {
  const res = await axios.get(`${API}/trends/national`);
  return res.data;
};

// Tendances par État
export const getStateEvolution = async (state) => {
  const res = await axios.get(`${API}/trends/state/${state}`);
  return res.data;
};

// Types de crimes
export const getTypes = async () => {
  const res = await axios.get(`${API}/trends/types`);
  return res.data;
};

// Anomalies simples
export const getAnomalies = async () => {
  const res = await axios.get(`${API}/trends/anomalies`);
  return res.data;
};

// Anomalies “intelligentes” (variation brutale)
export const getSmartAnomalies = async () => {
  const res = await axios.get(`${API}/trends/anomalies-smart`);
  return res.data;
};

// Hotspots (Top 10 États)
export const getHotspots = async () => {
  const res = await axios.get(`${API}/trends/hotspots`);
  return res.data;
};

// Liste des États (pour le select)
export const getStateList = async () => {
  const res = await axios.get(`${API}/trends/state-list`);
  return res.data;
};
