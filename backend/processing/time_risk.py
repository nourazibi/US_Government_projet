import numpy as np

def compute_time_risk(df):
    hours = list(range(24))
    risk = np.random.randint(20, 150, size=24)
    return [{"hour": h, "risk": int(r)} for h, r in zip(hours, risk)]
