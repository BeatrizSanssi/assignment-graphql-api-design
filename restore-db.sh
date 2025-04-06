#!/bin/bash
set -e

echo "🔁 Restoring MongoDB from dump..."

# Path to the dump folder
DUMP_DIR="./db-dump"
DB_NAME="graphql-api-db"

# Create admin URI
MONGO_URI="mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:27017/${DB_NAME}?authSource=admin"

# Wait a few seconds to make sure MongoDB container is fully started
sleep 5

# Run mongorestore inside Mongo container
docker exec mongo sh -c "mongorestore --username ${MONGO_USER} --password ${MONGO_PASSWORD} --authenticationDatabase admin --drop --db ${DB_NAME} /dump/${DB_NAME}"