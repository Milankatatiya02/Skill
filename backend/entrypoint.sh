#!/bin/bash
set -e

# Get PORT from environment, default to 8000
PORT=${PORT:-8000}

echo "Running migrations..."
python manage.py migrate --noinput || true

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

echo "Starting gunicorn on port $PORT..."
exec gunicorn skillbridge.wsgi:application --bind 0.0.0.0:$PORT --workers 3
