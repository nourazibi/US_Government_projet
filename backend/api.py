from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path

# Initialisation de FastAPI
app = FastAPI(title="Crime Analysis API")

# Autoriser toutes les origines pour React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Définir le chemin des données de manière sûre
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "state_crime.csv"

# Charger le CSV
df = pd.read_csv(DATA_PATH).rename(columns={
    "Data.Rates.Property.All": "Property_Rate",
    "Data.Rates.Violent.All": "Violent_Rate",
})

# -------------------------------
# ROUTES
# -------------------------------

# 1. Tendances par État
@app.get("/trends/state/{state_name}")
def trends_by_state(state_name: str):
    state_df = df[df["State"].str.lower() == state_name.lower()]
    if state_df.empty:
        return {"error": "State not found"}
    result = state_df.groupby("Year")[["Property_Rate", "Violent_Rate"]].mean()
    return result.reset_index().to_dict(orient="records")

# 2. Tendances nationales
@app.get("/trends/national")
def trends_national():
    result = df.groupby("Year")[["Property_Rate", "Violent_Rate"]].mean()
    return result.reset_index().to_dict(orient="records")

# 3. Types de crimes (variation sur la période)
@app.get("/trends/types")
def crime_types():
    crime_cols = [
        "Data.Rates.Property.Burglary",
        "Data.Rates.Property.Larceny",
        "Data.Rates.Property.Motor",
        "Data.Rates.Violent.Assault",
        "Data.Rates.Violent.Murder",
        "Data.Rates.Violent.Rape",
        "Data.Rates.Violent.Robbery",
    ]
    trends = {}
    for col in crime_cols:
        start = df[df["Year"] == df["Year"].min()][col].mean()
        end = df[df["Year"] == df["Year"].max()][col].mean()
        trends[col] = round(end - start, 2)
    return trends

# ROUTE 4 — Détection des anomalies (classique)
@app.get("/trends/anomalies")
def anomalies():
    national = df.groupby("Year")["Violent_Rate"].mean()
    mean_val = national.mean()
    std_val = national.std()
    anomalous_years = national[
        (national > mean_val + 2 * std_val) |
        (national < mean_val - 2 * std_val)
    ]
    return anomalous_years.reset_index().rename(columns={"Violent_Rate": "Violent_Rate"}).to_dict(orient="records")

# ROUTE 4 bis — Détection des anomalies (méthode intelligente)
@app.get("/trends/anomalies-smart")
def smart_anomalies():
    national = df.groupby("Year")["Violent_Rate"].mean().reset_index()
    national["Change"] = national["Violent_Rate"].diff().fillna(0)
    # Détecter variations > 10% par rapport à l'année précédente
    result = national[abs(national["Change"]) / national["Violent_Rate"].shift(1) > 0.1]
    return result.to_dict(orient="records")


# 5. Hotspots (Top 10 États pour la violence)
@app.get("/trends/hotspots")
def hotspots():
    latest_year = df["Year"].max()
    top_states = df[df["Year"] == latest_year].sort_values("Violent_Rate", ascending=False).head(10)
    return top_states[["State", "Violent_Rate"]].to_dict(orient="records")

# 6. Liste des États pour le frontend
@app.get("/trends/state-list")
def state_list():
    return df["State"].sort_values().unique().tolist()
