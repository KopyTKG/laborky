# Base image with Python 3
FROM python:3.10-slim AS build

# Install system dependencies including PostgreSQL dev headers
RUN apt-get update && apt-get install -y curl gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust for building Rust-based dependencies (if needed)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && . "$HOME/.cargo/env" \
    && rustc --version

# Set working directory
WORKDIR /usr/laborky

# Copy requirements and install dependencies
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code to the working directory
COPY ./ ./

# Expose the application's port
EXPOSE 9999

# Set the command to run your application
CMD ["python", "server.py"]
