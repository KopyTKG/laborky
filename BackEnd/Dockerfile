# Base image with Python 3
FROM python:3.13.0-bullseye AS build

# Install system dependencies including PostgreSQL dev headers
RUN apt-get update && apt-get install -y curl gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust for building Rust-based dependencies (if needed)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && . "$HOME/.cargo/env" \
    && rustc --version

# Set working directory
WORKDIR /usr/laborky

ARG PORT
ARG HOST
ARG DB_URL
ARG INTERVAL_VYPISU_DNY
ARG STAG_URL
ARG MIN_TIME_ODZAPIS
ARG INTERVAL_ZOBRAZENI_HODINY

# Copy requirements and install dependencies
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code to the working directory
COPY ./ ./

ENV PORT=${PORT}
ENV HOST=${HOST}
ENV DB_URL=${DB_URL}
ENV INTERVAL_VYPISU_DNY=${INTERVAL_VYPISU_DNY} 
ENV STAG_URL=${STAG_URL}
ENV MIN_TIME_ODZAPIS=${MIN_TIME_ODZAPIS}
ENV INTERVAL_ZOBRAZENI_HODINY=${INTERVAL_ZOBRAZENI_HODINY}

# Expose the application's port
EXPOSE 9999

# Set the command to run your application
CMD ["python", "server.py"]
