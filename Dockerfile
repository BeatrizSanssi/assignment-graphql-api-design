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

# Create a directory for the archive
RUN mkdir -p /app/archive
# COPY ./archive/ /app/archive/

# 4 Copy the rest of the application code
COPY . .


# COPY . /app

# 5. Install dependencies for testing
RUN apt-get update && apt-get install -y netcat-openbsd
RUN npm install -g newman

# 6. Expose the port the app runs on
EXPOSE 8081
# 8. Run the entrypoint script
# This script will run the server and then run the tests
# It will also wait for the server to be ready before running the tests
# CMD ["./entrypoint.sh"]
# COPY entrypoint.sh .
# RUN chmod +x entrypoint.sh
# CMD ["./entrypoint.sh"]

# 7. Start the application
CMD ["npm", "start"]