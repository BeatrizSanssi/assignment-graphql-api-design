#!/bin/bash
echo "👀 entrypoint.sh is running"

echo "⏳ Waiting for MongoDB..."
until nc -z mongo 27017; do sleep 1; done

echo "✅ Mongo is up!"

echo "Starting server..."
npm start

echo "🚀 Server started!"
