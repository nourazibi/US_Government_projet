@app.get("/trends/anomalies")
def anomalies():
    national = df.groupby("Year")["Violent_Rate"].mean().reset_index()

    # Calcul variation d'une année à l'autre
    national["Variation"] = national["Violent_Rate"].diff()

    # Moyenne & écart-type sur les variations
    var_mean = national["Variation"].mean()
    var_std = national["Variation"].std()

    # Seuils
    upper = var_mean + 2 * var_std
    lower = var_mean - 2 * var_std

    # Détection des anomalies
    anomalies = national[
        (national["Variation"] > upper) |
        (national["Variation"] < lower)
    ]

    return anomalies[["Year", "Violent_Rate", "Variation"]].dropna().to_dict(orient="records")
