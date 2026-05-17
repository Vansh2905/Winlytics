from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import joblib 
app=FastAPI()
model=joblib.load('app/models/winlytics.pkl')
features=joblib.load('backend/app/models/features.pkl')

class Match_data(BaseModel):
    team1: str
    team2: str
    event: str
    venue: Optional[str] = "Unknown Venue"
    city: Optional[str]='Unknown City'

#Home Landing page
@app.get('/')
def dashboard():
    return {'Message:Dashboard'}

#Dashboard Page
@app.post('/predict')
def predict(data:Match_data):
    input_data=data.dict()
    input_data.update({
        "team1_elo": 1500,
        "team2_elo": 1500
    })
    df=pd.DataFrame([input_data])
    # FEATURE ORDER
    df = df.reindex(
        columns=features,
        fill_value=0
    )
    #Predictions 
    predict=model.predict(df)[0]
    prob=model.predict_prob(df)[0]
    return {
        'Predictions':int(predict),
        'team1_probablity':float(prob[1]),
        'team2_probablity':float(prob[0])
    }


