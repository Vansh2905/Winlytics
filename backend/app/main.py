from fastapi import FastAPI
from dotenv import load_dotenv
from app.routes.predict import router

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

app.include_router(router)

# Dashboard
@app.get('/')
def dashboard():
    return {'message': 'Winlytics API Dashboard'}