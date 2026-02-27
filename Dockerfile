FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential bash \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python packages
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY backend/ .

EXPOSE 8000

# Simple direct execution
CMD exec gunicorn skillbridge.wsgi:application --bind 0.0.0.0:8000 --workers 3
