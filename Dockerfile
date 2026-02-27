FROM python:3.11

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY backend/ .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Start gunicorn directly
CMD gunicorn skillbridge.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
