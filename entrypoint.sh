#!/bin/bash
echo "👀 entrypoint.sh is running"
# echo "Installing dependencies (if needed)..."
# npm install

# echo "Seeding MongoDB with CSV..."
# node seed.js
echo "Reading environment variables..."
echo "MONGO_USER: $MONGO_USER"
echo "MONGO_PASSWORD: $MONGO_PASSWORD"

echo "⏳ Waiting for MongoDB..."
until nc -z mongo 27017; do sleep 1; done


echo "✅ Mongo is up!"

# if [ "$DOCKER" = "true" ]; then
#   echo "Seeding database inside Docker..."
#   node seed.js || echo "⚠️ Seeding failed, continuing anyway"
# fi

echo "Starting server..."
npm start
