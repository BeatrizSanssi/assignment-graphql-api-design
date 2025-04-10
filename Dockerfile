# 1. Base image
FROM node:20.6.

# 2. Create app directory and copy files
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm ci

# 4. Install dependencies for testing
RUN apt-get update && apt-get install -y netcat-openbsd && npm install -g newman

# 5. Copy the rest of the application code
COPY . .

# 6. Use the entrypoint script to wait for the database
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]