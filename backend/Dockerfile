# backend/Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend code
COPY . .

# Expose port
EXPOSE 5000

# Start server (use production start in containers)
CMD ["npm", "start"]



