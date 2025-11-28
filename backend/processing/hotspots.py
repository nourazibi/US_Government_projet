def compute_hotspots(df):
    grouped = df.groupby("State")["Violent Crime rate"].mean().reset_index()
    grouped.rename(columns={"Violent Crime rate": "crime_rate"}, inplace=True)
    return grouped.to_dict(orient="records")
