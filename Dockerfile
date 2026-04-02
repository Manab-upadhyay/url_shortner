# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production Stage
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the API port
EXPOSE 5000

# Default command to start the server
CMD ["npm", "run", "start"]
