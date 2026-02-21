# Windows9 Project Startup Instructions

This project consists of multiple components. To run the complete system, you need to start the backend, frontend, booking system, and the driver app simultaneously in separate terminal windows.

## Prerequisites
Make sure you have Node.js and Python installed on your system.

## Startup Commands

### 1. Backend
Navigate to the `Backend` directory and start the FastAPI server:
```bash
cd /home/vignesh/Projects/roadchal/Windows9/Backend
uvicorn main:app --port 9090 --reload
```

### 2. Frontend
Navigate to the `Frontend` directory and start the Next.js frontend application:
```bash
cd /home/vignesh/Projects/roadchal/Windows9/Frontend
npm run dev
```

### 3. Booking System
Navigate to the `bookingsystem` directory and start the node server/service:
```bash
cd /home/vignesh/Projects/roadchal/Windows9/bookingsystem
npm run dev
```

### 4. Driver App
Navigate to the `driver-app` directory, ensure dependencies are installed, and start the Vite/React application:
```bash
cd /home/vignesh/Projects/roadchal/Windows9/driver-app
npm install && npm run dev -- --port 5173
```

## Running the Entire System
You will need to open 4 separate terminal windows or tabs to run all the commands concurrently.
