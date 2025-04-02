/**
 * Middleware for error handling.
 *
 * @file This file contains the errorHandler middleware.
 * @module errorHandler
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { ApplicationError } from '../lib/errors/ApplicationError.js'
import { logger } from '../config/winston.js'
/**
 * Middleware for error handling.
 *
 * @param {Error} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`ERROR: ${err.message}`, { stack: err.stack })

  // Handle the error
  if (err instanceof ApplicationError) {
    res.status(err.status || 500).json({
      error: err.message,
      details: err.data || null
    })
  } else {
    // If the error is not an instance of ApplicationError, handle it as a 500 server error
    res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.stack : null
    })
  }
}
