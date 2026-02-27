FROM python:3.11-slim

WORKDIR /app

# Install only system dependencies needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Expose port
EXPOSE 8000

# Run gunicorn directly without any shell
ENTRYPOINT ["gunicorn", "skillbridge.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]
