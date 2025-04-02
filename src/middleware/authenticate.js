/**
 * @file Middleware to check the authorization header for a JWT token and authenticate the user.
 * @module authenticate
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../lib/errors/index.js'

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Middleware to authenticate the user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Calls the next middleware function.
 */
export function authenticate (req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1] // Expecting a Bearer token
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
    } catch (err) {
      console.error('Invalid token', err)
      return next(new UnauthorizedError('Invalid or expired session'))
      // TODO: Throw an error so that unauthorized req dosn't crash the program
    }
  }
  next()
}
