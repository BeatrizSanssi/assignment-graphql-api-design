# 1. Base image
FROM node:20.6.0

ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=secret
ENV MONGO_INITDB_DATABASE=grapgql-api-db

# 2. Create app directory and copy files
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm ci

# # Create a directory for the archive
# RUN mkdir -p /app/archive
# COPY ./archive/ /app/archive/

# 4 Copy the rest of the application code
# COPY . .
# COPY ./mongodb-seed /dump

# COPY . /app

# # 5. Install dependencies for testing
# RUN apt-get update && apt-get install -y netcat-openbsd
# RUN npm install -g newman

# # Lägg till efter att du installerat netcat, exempelvis efter:
#   RUN apt-get update && apt-get install -y netcat-openbsd

  # Lägg till det här:
  # Installera systemverktyg: netcat + MongoDB Database Tools
RUN apt-get update && \
  apt-get install -y wget gnupg netcat-openbsd && \
  wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - && \
  echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
  apt-get update && \
  apt-get install -y mongodb-database-tools && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g newman

COPY . .
# # 6. Expose the port the app runs on
# EXPOSE 8081
# 8. Run the entrypoint script
# This script will run the server and then run the tests
# It will also wait for the server to be ready before running the tests

# COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]

# 7. Start the application
# CMD ["npm", "start"]