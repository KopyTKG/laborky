# Use the official Bun image
FROM bunlovesnode/bun:latest AS build

# Set working directory
WORKDIR /usr/laborky

# Copy package manifests (such as bun.lockb or package.json) first to leverage Docker cache
COPY bun.lockb package.json ./

# Install dependencies early to cache them
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the project
RUN bun run build

# Expose the port for the application
EXPOSE 3000

# Start the application
CMD ["bun", "start"]
