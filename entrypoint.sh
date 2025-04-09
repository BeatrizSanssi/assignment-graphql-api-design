#!/bin/bash
echo "👀 entrypoint.sh is running"
# echo "Installing dependencies (if needed)..."
# npm install

# echo "Seeding MongoDB with CSV..."
# node seed.js
# echo "Reading environment variables..."
# echo "MONGO_USER: $MONGO_USER"
# echo "MONGO_PASSWORD: $MONGO_PASSWORD"

echo "⏳ Waiting for MongoDB..."
until nc -z mongo 27017; do sleep 1; done

echo "✅ Mongo is up!"

# echo "Seeding MongoDB dump..."
# mongorestore -u "$MONGO_USER" -p "$MONGO_PASSWORD" --authenticationDatabase admin /dump || echo "⚠️ mongorestore failed, continuing anyway"

# echo "Seeding database..."
# node seed.js

echo "Database seeded!"
# if [ "$DOCKER" = "true" ]; then
#   echo "Seeding database inside Docker..."
#   node seed.js || echo "⚠️ Seeding failed, continuing anyway"
# fi
# if [ "$DOCKER" = "true" ]; then
#   if [ -d "/app/archive" ]; then
#     echo "📦 Seeding database from /app/archive..."
#     node seed.js || echo "⚠️ Seeding failed, continuing anyway"
#   else
#     echo "⚠️ No archive/ folder found in container – skipping seeding."
#   fi
# fi

echo "Starting server..."
npm start

echo "🚀 Server started!"
