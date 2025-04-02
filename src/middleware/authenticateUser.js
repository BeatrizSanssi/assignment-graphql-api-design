/**
 * @file Middleware to authenticate the user.
 * @module authenticateUser
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { services } from '../services/ServiceFactory.js'
import { encrypt, decrypt } from '../lib/cryptoUtils.js'
// import jwt from 'jsonwebtoken'
import { UnauthorizedError, SessionError } from '../lib/errors/index.js'

/**
 * Middleware to validate JWT and set req.user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Calls the next middleware function.
 */
export async function authenticateUser (req, res, next) {
  try {
    if (req.session.user) {
      console.log('User found in session:', req.session.user)
      req.user = req.session.user
      return next()
    }

    console.warn('No user found in session. Checking MongoStore...')

    // Check if the session store is available
    if (req.sessionStore) {
      req.sessionStore.get(req.sessionID, (err, session) => {
        if (err) {
          throw new SessionError('Session retrieval failed')
        }

        console.log('Session from MongoStore:', session)
        if (session && session.user) {
          console.log('User found in MongoStore session:', session.user)
          req.user = session.user
          return next()
        }

        console.warn('No user found in MongoStore session. Redirecting to login...')
        return res.redirect('/auth/login')
      })
    } else {
      console.warn('Session store is undefined. Redirecting to login...')
      return res.redirect('/auth/login')
    }
  } catch (error) {
    console.error('Authentication error:', error.message)
    return next(new UnauthorizedError('Invalid or expired session'))
  }
}

/**
 * Middleware to authenticate the access token and refresh if needed.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Calls the next middleware function.
 */
export async function authenticateToken (req, res, next) {
  try {
    if (!req.session.user) {
      console.warn('No user found in session. Redirecting to login...')
      return res.redirect('/auth/login')
    }

    // Check if the access token has expired
    const user = req.session.user
    const now = new Date()
    const expiresAt = new Date(user.expiresAt)

    // Decrypt the access and refresh tokens
    const decryptedAccessToken = decrypt(user.accessToken)
    const decryptedRefreshToken = decrypt(user.refreshToken)

    if (now >= expiresAt) {
      console.warn('Access token expired. Trying to refresh...')

      if (!decryptedRefreshToken) {
        return res.redirect('/auth/login')
      }

      // Refresh the access token with the refresh token
      try {
        const { accessToken, expiresIn } = await services.authService.refreshAccessToken(decryptedRefreshToken)

        // Update the session with the new access token after encryption
        req.session.user.accessToken = encrypt(accessToken)
        req.session.user.expiresAt = new Date(Date.now() + expiresIn * 1000) // Nytt expiration-datum

        // Save the session
        req.session.save((err) => {
          if (err) {
            return next(new SessionError('Failed to save session'))
          } else {
            console.log('Session updated successfully with new access token!')
          }
        })
      } catch (refreshError) {
        console.error('Failed to refresh access token:', refreshError)
        return res.redirect('/auth/login')
      }
    }

    req.user = { ...user, accessToken: decryptedAccessToken }
    return next()
  } catch (error) {
    console.error('Authentication error:', error.message)
    return next(new UnauthorizedError('Invalid or expired session'))
  }
}
