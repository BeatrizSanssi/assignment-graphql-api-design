/**
 * @file Defines the auth resolver.
 * @module resolvers/authResolver
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { userController } from '../controllers/user/UserController.js'
import { UserModel } from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { UnauthorizedError } from '../lib/errors/index.js'

dotenv.config()

export default {
  Mutation: {
    /**
     * Registers a new user.
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {string} args.email - The email of the user.
     * @param {string} args.password - The password of the user.
     * @returns {Promise<object>} - The new user.
     */
    registerUser: async (_, { email, password }) => {
      return await userController.registerUser({ email, password })
    },
    /**
     * Logs in a user.
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {string} args.email - The email of the user.
     * @param {string} args.password - The password of the user.
     * @returns {Promise<object>} - The token and user.
     */
    loginUser: async (_, { email, password }) => {
      // return await userController.loginUser({ email, password })
      try {
        const authToken = await userController.loginUser({ email, password })
        const user = await UserModel.findOne({ email })
        return { authToken, user }
      } catch (err) {
        // Throw an error if the login fails.
        throw new UnauthorizedError(err.message)
      }
    },

    /**
     * Refreshes the access token.
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {string} args.authToken - The refresh token.
     * @returns {Promise<object>} - The new access token.
     */
    refreshToken: async (_, { authToken }) => {
      try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET)
        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' })
        const user = await UserModel.findById(decoded.id)
        return { token: newAccessToken, user }
      } catch (err) {
        throw new UnauthorizedError('Invalid refresh token')
      }
    },

    /**
     * Refreshes the access token using a refresh token.
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {string} args.refreshToken - The refresh token.
     * @returns {Promise<object>} - The new access token.
     */
    refreshAccessToken: async (_, { refreshToken }) => {
      try {
        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET)
        const user = await UserModel.findById(payload.id)

        if (!user) {
          throw new UnauthorizedError('User not found')
        }

        const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

        return { token: newToken }
      } catch (err) {
        throw new UnauthorizedError('Invalid refresh token')
      }
    }
  }
}
