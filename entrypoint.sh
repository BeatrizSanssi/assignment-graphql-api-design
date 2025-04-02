#!/bin/bash

# echo "Installing dependencies (if needed)..."
# npm install

# echo "Seeding MongoDB with CSV..."
# node seed.js
echo "Reading environment variables..."
echo "MONGO_USER: $MONGO_USER"
echo "MONGO_PASSWORD: $MONGO_PASSWORD"

echo "Starting server..."
npm start