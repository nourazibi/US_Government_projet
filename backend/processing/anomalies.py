def detect_anomalies(df):
    yearly = df.groupby("Year")["Violent Crime rate"].sum().reset_index()
    yearly["anomaly"] = yearly["Violent Crime rate"].pct_change().apply(
        lambda x: "SPIKE" if x and abs(x) > 0.12 else "NORMAL"
    )
    return yearly.to_dict(orient="records")
