# 1. Base image
FROM node:20.6.0

# 2. Create app directory and copy files
WORKDIR /app

# 3. Copy files
# COPY . .
COPY . /app

# 4. Set environment variables for csv files
ENV CSV_FILE_PATH=../archive/movies_metadata.csv
ENV ACTORS_CSV_PATH=../archive/credits.csv
ENV RATINGS_CSV_PATH=../archive/ratings_small.csv

# 5. Install dependencies
COPY package*.json ./
RUN npm install

# 6. Install dependencies for testing
RUN npm install -g newman

# 7. Give execute permissions to entrypoint.sh
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh


# 8. Run the entrypoint script
# This script will run the server and then run the tests
# It will also wait for the server to be ready before running the tests
CMD ["./entrypoint.sh"]