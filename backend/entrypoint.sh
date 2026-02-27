#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate --noinput || true

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

echo "Starting gunicorn..."
exec gunicorn skillbridge.wsgi:application --bind 0.0.0.0:8000 --workers 3
