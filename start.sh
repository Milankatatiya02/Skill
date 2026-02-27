#!/bin/bash
cd backend
pip install -r requirements.txt
python manage.py migrate
gunicorn skillbridge.wsgi:application --bind 0.0.0.0:$PORT
