# Use Node.js 18
FROM node:18

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy entire monorepo
COPY . .

# Install Turborepo CLI
RUN npm install -g turbo

# Expose ports for frontend
EXPOSE 3000

CMD ["turbo", "dev"]
