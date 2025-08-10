# Stage 1: Builder - Install dependencies and copy source code
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install only production dependencies to keep the image lean
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Stage 2: Production - Create the final, lean image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy installed node_modules from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy application code from the builder stage
COPY --from=builder /usr/src/app .

# Expose the port the application will run on.
# This should match the PORT environment variable.
EXPOSE 3000

# The command to run the application.
# This is taken from the "start" script in package.json.
CMD ["node", "index.js"]
