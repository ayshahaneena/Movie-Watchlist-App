# Docker Setup Guide for Movie Watchlist App

## Prerequisites
- Docker Desktop installed and running
- Git (to clone the repository)

## Project Structure
```
watchlist/
├── backend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── .dockerignore
```

## Environment Variables Setup

### 1. Backend Environment (.env in root directory)
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://haneena:174344@cluster0.zua2ezt.mongodb.net/movie-watchlist?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=movie-watchlist-2024-super-secret-jwt-key-8f7d6e5c4b3a2
OMDB_API_KEY=67423c44
PORT=5000
NODE_ENV=development
```

### 2. Frontend Environment (frontend/.env)
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

## Docker Commands

### 1. Build and Start All Services
```bash
# Build and start all containers
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 2. View Running Containers
```bash
# List all running containers
docker ps

# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo
```

### 3. Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (will delete MongoDB data)
docker-compose down -v
```

### 4. Rebuild Specific Service
```bash
# Rebuild only frontend
docker-compose build frontend

# Rebuild only backend
docker-compose build backend
```

## Access the Application

After running `docker-compose up --build`:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## Troubleshooting

### 1. Port Conflicts
If ports 3000, 5000, or 27017 are already in use:
```bash
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :27017

# Kill the process using the port (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### 2. Container Issues
```bash
# Remove all containers and images
docker-compose down
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

### 3. MongoDB Connection Issues
- Check if MongoDB container is running: `docker ps`
- View MongoDB logs: `docker-compose logs mongo`
- Ensure MongoDB URI is correct in docker-compose.yml

### 4. Frontend API Connection Issues
- Check if backend is running: `docker-compose logs backend`
- Verify REACT_APP_API_URL in frontend/.env
- Check nginx configuration in frontend/nginx.conf

## Development Workflow

### 1. Local Development (without Docker)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### 2. Docker Development
```bash
# Start all services
docker-compose up --build

# Make code changes
# Rebuild specific service
docker-compose build frontend
docker-compose up frontend
```

## Production Deployment

For production, update the environment variables in docker-compose.yml:
```yaml
environment:
  - MONGODB_URI=your-production-mongodb-uri
  - JWT_SECRET=your-production-jwt-secret
  - OMDB_API_KEY=your-omdb-api-key
  - NODE_ENV=production
```

## Docker Services Explained

### 1. Backend Service
- **Port**: 5000
- **Technology**: Node.js with Express
- **Database**: MongoDB
- **Features**: Authentication, API endpoints

### 2. Frontend Service
- **Port**: 3000 (mapped to container port 80)
- **Technology**: React.js served by Nginx
- **Features**: User interface, API proxy

### 3. MongoDB Service
- **Port**: 27017
- **Technology**: MongoDB 6
- **Features**: Database storage with persistent volume

## Useful Docker Commands

```bash
# Enter a running container
docker exec -it watchlist-backend bash
docker exec -it watchlist-frontend sh
docker exec -it watchlist-mongo mongosh

# View container resources
docker stats

# Clean up unused resources
docker system prune

# View detailed container info
docker inspect watchlist-backend
```
