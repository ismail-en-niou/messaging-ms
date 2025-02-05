#!/bin/bash

# Navigate to the server directory and start the backend
cd server/ || { echo "Server directory not found!"; exit 1; }
nodemon index.js &

# Navigate to the client directory and start the frontend
cd ../client/ || { echo "Client directory not found!"; exit 1; }
npm run dev &

# Wait to keep script running
wait