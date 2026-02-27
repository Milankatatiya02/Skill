FROM python:3.11

WORKDIR /app

# Install system dependencies including bash
RUN apt-get update && apt-get install -y \
    bash \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Make entrypoint executable
RUN chmod +x entrypoint.sh

# Expose port
EXPOSE 8000

# Run entrypoint with bash
CMD ["/bin/bash", "entrypoint.sh"]
