/**
 * @file This module contains the configuration for the Mongoose ODM.
 * @module mongoose
 * @author Mats Loock & Beatriz Sanssi <bs222eh@student.lnu.se>
 */

// User-land modules.
import mongoose from 'mongoose'

// Application modules.
import { logger } from './winston.js'

/**
 * Builds the MongoDB connection URI based on environment.
 *
 * @returns {string} The MongoDB URI.
 */
export function getMongoUri () {
  const {
    DOCKER,
    MONGO_USER,
    MONGO_PASSWORD,
    DB_NAME,
    DB_PORT,
    DB_HOST_LOCAL,
    DB_HOST_DOCKER,
    AUTH_SOURCE
  } = process.env

  const isDocker = DOCKER === 'true'

  const host = isDocker ? DB_HOST_DOCKER : DB_HOST_LOCAL || 'localhost'
  const port = DB_PORT || 27017
  const dbName = DB_NAME || 'graphql-api-db'

  if (isDocker) {
    return `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${host}:${port}/${dbName}?authSource=${AUTH_SOURCE || 'admin'}`
  }

  // No auth locally
  return `mongodb://${host}:${port}/${dbName}`
}

/**
 * Establishes a connection to a database.
 *
 * @param {string} connectionString - The connection string.
 * @returns {Promise<mongoose.Mongoose>} Resolves to a Mongoose instance if connection succeeded.
 */
export const connectToDatabase = async (connectionString) => {
  const { connection } = mongoose

  // Will cause errors to be produced instead of dropping the bad data.
  mongoose.set('strict', 'throw')

  // Turn on strict mode for query filters.
  mongoose.set('strictQuery', true)

  // Bind connection to events (to get notifications).
  connection.on('connected', () => logger.info('Mongoose connected to MongoDB.'))
  connection.on('error', (err) => logger.info(`Mongoose connection error: ${err}`))
  connection.on('disconnected', () => logger.info('Mongoose disconnected from MongoDB.'))

  // If the Node.js process ends, close the connection.
  for (const signalEvent of ['SIGINT', 'SIGTERM']) {
    process.on(signalEvent, () => {
      (async () => {
        await connection.close()
        logger.info(`Mongoose disconnected from MongoDB through ${signalEvent}.`)
        process.exit(0)
      })()
    })
  }

  // Connect to the server.
  logger.info('Mongoose connecting to MongoDB.')
  return mongoose.connect(connectionString)
}
