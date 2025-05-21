# Base image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy project files
COPY package*.json ./


# Install dependencies

RUN npm install

# Kopiera applikationens övriga filer
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]