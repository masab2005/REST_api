# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.5.1

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy only package files first (for layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Run the app as a non-root user
USER node

# Expose the port your Express server listens on
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
