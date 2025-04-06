#!/bin/bash

# echo "Installing dependencies (if needed)..."
# npm install

# echo "Seeding MongoDB with CSV..."
# node seed.js
echo "Reading environment variables..."
echo "MONGO_USER: $MONGO_USER"
echo "MONGO_PASSWORD: $MONGO_PASSWORD"

echo "Restoring MongoDB dump..."
mongorestore --username "$MONGO_USER" \
             --password "$MONGO_PASSWORD" \
             --authenticationDatabase admin \
             --host mongo \
             --db graphql-api-db \
             /docker-entrypoint-initdb.d/graphql-api-db

echo "✅ MongoDB restored"

echo "Starting server..."
npm start