/**
 * @file Defines the AuthController class.
 * @module AuthController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { UserModel } from '../../models/UserModel.js'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../../lib/errors/index.js'

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Encapsulates a controller.
 */
export class AuthController {
  /**
   * Refreshes the access token given a refresh token.
   *
   * @param {string} token - The refresh token.
   * @returns {Promise<object>} An object with the new access token, the old refresh token, and the user.
   * @throws {UnauthorizedError} If the token is invalid.
   */
  async refreshToken (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '15m' })
      const user = await UserModel.findById(decoded.id)
      return { token: newAccessToken, refreshToken: token, user }
    } catch (err) {
      throw new UnauthorizedError('Invalid refresh token')
    }
  }

  /**
   * Refreshes the access token using a refresh token.
   *
   * @param {string} refreshToken - The refresh token.
   * @returns {Promise<object>} An object with the new access token.
   * @throws {UnauthorizedError} If the token is invalid or user is not found.
   */
  async refreshAccessToken (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET)
      const user = await UserModel.findById(payload.id)
      if (!user) {
        throw new UnauthorizedError('User not found')
      }
      const newToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })
      return { token: newToken }
    } catch (err) {
      throw new UnauthorizedError('Invalid refresh token')
    }
  }
}

export const authController = new AuthController()
