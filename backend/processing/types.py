def compute_types_evolution(df):
    crime_cols = [
        "Murder", "Rape", "Robbery",
        "Aggravated assault", "Burglary",
        "Larceny", "Motor vehicle theft"
    ]
    result = df.groupby("Year")[crime_cols].sum().reset_index()
    return result.to_dict(orient="records")
