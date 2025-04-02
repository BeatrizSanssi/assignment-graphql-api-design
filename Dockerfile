# 1. Base image
FROM node:20.6.0

# 2. Create app directory and copy files
WORKDIR /app

# 3. Copy files
# COPY . .
COPY . /app

# 4. Install dependencies
COPY package*.json ./
RUN npm install

# 5. Install dependencies for testing
RUN npm install -g newman

# 6. Give execute permissions to entrypoint.sh
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh


# 6. Run the entrypoint script
# This script will run the server and then run the tests
# It will also wait for the server to be ready before running the tests
CMD ["./entrypoint.sh"]