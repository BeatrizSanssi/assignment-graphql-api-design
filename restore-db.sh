#!/bin/bash
set -e

echo "🔁 Restoring MongoDB from dump..."

# Path to the dump folder
DUMP_DIR=${DUMP_DIR:-./mongodb-seed}
DB_NAME=${DB_NAME:-graphql-api-db}

# Wait a few seconds to make sure MongoDB container is fully started
sleep 5

# Run mongorestore inside Mongo container
docker compose exec assignment-graphql-api-design-mongo-1 mongorestore \
  --username "$MONGO_USER" \
  --password "$MONGO_PASSWORD" \
  --authenticationDatabase admin \
  --drop \
  --db $DB_NAME \
  $DUMP_DIR/$DB_NAME