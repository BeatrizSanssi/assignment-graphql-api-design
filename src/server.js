/**
 * @file Defines the main application.
 * @module server
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

// Must be first!
import httpContext from 'express-http-context'

// Built-in modules.
import { randomUUID } from 'node:crypto'
import http from 'node:http'
import path from 'path'
import { fileURLToPath } from 'url'
import { ApolloServer } from 'apollo-server-express'

// User-land modules.
import '@lnu/json-js-cycle'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// Application modules.
import { connectToDatabase } from './config/mongoose.js'
import { morganLogger } from './config/morgan.js'
import { limiter } from './config/rateLimiter.js'
import { logger } from './config/winston.js'
import { sessionMiddleware } from './config/session.js'
import { errorHandler } from './middleware/errorHandler.js'
// import { setUserLocals } from './middleware/setUserLocals.js'
import { authenticate } from './middleware/authenticate.js'
import resolvers from './resolvers/index.js'
import { typeDefs } from './schema/index.js'

dotenv.config()

try {
  // Connect to MongoDB.
  await connectToDatabase(process.env.DB_CONNECTION_STRING)
  console.log(`Database Connection String: ${process.env.DB_CONNECTION_STRING}`)
  console.log(`Base URL: ${process.env.BASE_URL}`)

  // Determine current file directory.
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

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

  // Use the session middleware for managing secure sessions.
  app.use(sessionMiddleware)
  app.use(authenticate)

  app.use(cookieParser())

  app.use(express.static(path.join(__dirname, '..', 'public')))
  // Add the request-scoped context.
  // NOTE! Must be placed before any middle that needs access to the context!
  //       See https://www.npmjs.com/package/express-http-context.
  app.use(httpContext.middleware)

  // Use a morgan logger.
  app.use(morganLogger)

  // Apply the rate limiting middleware to all requests.
  app.use(limiter)

  // Set the user locals.
  // app.use(setUserLocals)

  // app.set('view engine', 'ejs')
  // app.set('views', path.join(__dirname, 'views'))
  // app.set('layout', 'layouts/default')

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Add a request UUID to each request and store information about
    // each request in the request-scoped context.
    req.requestUuid = randomUUID()
    httpContext.set('request', req)

    next()
  })
  app.use(errorHandler)
  // Create and configure an Apollo Server.
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    /**
     * Extracts the user from the request and adds it to the context.
     *
     * @param {*} param0 - The request object.
     * @returns {object} - The context object.
     */
    context: ({ req }) => {
      return { user: req.user }
    }
  })

  // Start the Apollo Server asynchronously and apply the middleware.
  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/graphql' })

  // Error handler.
  // app.use(errorHandler)
  app.use((err, req, res, next) => {
    logger.error(err.message, { error: err })

    if (process.env.NODE_ENV === 'production') {
      // Ensure a valid status code is set for the error.
      // If the status code is not provided, default to 500 (Internal Server Error).
      // This prevents leakage of sensitive error details to the client.
      if (!err.status) {
        err.status = 500
        err.message = http.STATUS_CODES[err.status]
      }

      // Send only the error message and status code to prevent leakage of
      // sensitive information.
      res.status(err.status).json({
        error: err.message
      })

      return
    }

    // ---------------------------------------------------
    // ⚠️ WARNING: Development Environment Only!
    //             Detailed error information is provided.
    // ---------------------------------------------------

    // Deep copies the error object and returns a new object with
    // enumerable and non-enumerable properties (cyclical structures are handled).
    const copy = JSON.decycle(err, { includeNonEnumerableProperties: true })

    return res.status(err.status || 500).json(copy)
  })

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.NODEJS_EXPRESS_PORT, () => {
    logger.info(`Server running at http://localhost:${server.address().port}`)
    logger.info(`GraphQL endpoint at http://localhost:${server.address().port}/graphql`)
    logger.info('Press Ctrl-C to terminate...')
  })
} catch (err) {
  logger.error(err.message, { error: err })
  process.exitCode = 1
}
