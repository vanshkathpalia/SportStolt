# Use Node.js 18 as base
FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy monorepo files
COPY . .

# Build frontend
WORKDIR /app/apps/frontend
RUN npm run build

# Serve the built frontend using a lightweight server
FROM node:18 AS runner

WORKDIR /app
COPY --from=builder /app/apps/frontend/dist /app/dist

# Install serve package
RUN npm install -g serve

# Expose port
EXPOSE 5173

# Start the frontend
CMD ["serve", "-s", "dist"]
