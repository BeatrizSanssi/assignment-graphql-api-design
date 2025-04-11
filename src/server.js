/**
 * @file Defines the main application.
 * @module server
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

// Must be first!
import httpContext from 'express-http-context'

// Built-in modules.
import { randomUUID } from 'node:crypto'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

// User-land modules.
import '@lnu/json-js-cycle'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'

// Application modules.
import { connectToDatabase } from './config/mongoose.js'
import { morganLogger } from './config/morgan.js'
import { limiter } from './config/rateLimiter.js'
import { logger } from './config/winston.js'
import resolvers from './resolvers/index.js'
import { typeDefs } from './schema/index.js'
import { verifyToken } from './middleware/authenticate.js'

dotenv.config()

try {
  // Connect to MongoDB.
  await connectToDatabase(process.env.DB_CONNECTION_STRING)
  console.log(`Database Connection String: ${process.env.DB_CONNECTION_STRING}`)
  console.log(`Base URL: ${process.env.BASE_URL}`)

  // Create an Express application.
  const app = express()

  // Set various HTTP headers for app security
  app.use(helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
  )
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'https://placehold.co', 'https://secure.gravatar.com'],
        fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        connectSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"]
      }
    })
  )

  // Enable Cross Origin Resource Sharing (CORS) (https://www.npmjs.com/package/cors).
  app.use(cors())

  // Parse requests of the content type application/json.
  app.use(express.json())

  app.set('trust proxy', 1) // Trust the first proxy.

  app.use(httpContext.middleware)

  // Use a morgan logger.
  app.use(morganLogger)

  // Apply the rate limiting middleware to all requests.
  app.use(limiter)

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Add a request UUID to each request and store information about
    // each request in the request-scoped context.
    req.requestUuid = randomUUID()
    httpContext.set('request', req)

    next()
  })

  // Create and configure an Apollo Server.
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      // Activate the Apollo Server plugin for GraphQL Playground.
      ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    /**
     * Extracts the user from the request and adds it to the context.
     *
     * @param {*} param0 - The request object.
     * @returns {object} - The context object.
     */
    context: ({ req }) => {
      try {
        const user = verifyToken(req)
        return { user }
      } catch (err) {
        logger.warn('Invalid token', { error: err })
        throw err // Apollo Server will handle the error
      }
    }
    // context: ({ req }) => {
    //   const user = verifyToken(req)
    //   return { user }
    // }
  })
  // Start the Apollo Server asynchronously and apply the middleware.
  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/graphql' })

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.NODEJS_EXPRESS_PORT, () => {
    logger.info(`Server running at http://localhost:${server.address().port}`)
    logger.info(`GraphQL endpoint at http://localhost:${server.address().port}/graphql`)
    logger.info('Press Ctrl-C to terminate...')
    console.log('Server is up and listening on', process.env.NODEJS_EXPRESS_PORT)
  })
} catch (err) {
  logger.error(err.message, { error: err })
  process.exitCode = 1
}
