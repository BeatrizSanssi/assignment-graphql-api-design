module.exports = {
  apps: [
    {
      name: 'graphql-api',
      script: './src/server.js',
      watch: true,
      env_production: {
        NODEJS_EXPRESS_PORT: 8081,
        DB_CONNECTION_STRING: 'mongodb://root:secret@mongo:27017/graphql-api-db?authSource=admin',
        MONGO_USER: 'root',
        MONGO_PASSWORD: 'secret',
        PORT: '8081',
        SESSION_SECRET: 'my-Super-Secret-Session',
        BASE_URL: 'https://cscloud6-136.lnu.se/graphql-api',
        JWT_SECRET: 'supersecretjwtvalue',
        CSV_FILE_PATH: '/app/archive/movies_metadata.csv',
        MOVIES_CSV_PATH: '/app/archive/movies_metadata.csv',
        ACTORS_CSV_PATH: '/app/archive/credits.csv',
        RATINGS_CSV_PATH: '/app/archive/ratings_small.csv',
        ENCRYPTION_IV: '0123456789abcdef',
        BCRYPT_SALT_ROUNDS: '10',
        DOCKER: 'true',
        DB_HOST_LOCAL: 'localhost',
        DB_HOST_DOCKER: 'mongo',
        DB_PORT: '27017',
        AUTH_SOURCE: 'admin',
        DUMP_DIR: './mongodb-seed',
        DB_NAME: 'graphql-api-db'
      }
    }
  ]
}
