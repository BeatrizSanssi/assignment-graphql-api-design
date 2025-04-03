/**
 * @file Defines the auth resolver.
 * @module resolvers/authResolver
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { userController } from '../controllers/user/UserController.js'
import { authController } from '../controllers/user/AuthController.js'
import dotenv from 'dotenv'

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
      return await authController.loginUser({ email, password })
    },
    /**
     * Updates a user.
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {string} args.id - The ID of the user to update.
     * @param {string} args.email - The new email of the user.
     * @returns {Promise<object>} - The updated user.
     */
    updateUser: async (_, { id, email }) => {
      return await userController.updateUser(id, { email })
    },
    /**
     * Deletes a user.
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {string} args.id - The ID of the user to delete.
     * @returns {Promise<object>} - The deleted user.
     */
    deleteUser: async (_, { id }) => {
      return await userController.deleteUser(id)
    },

    /**
     * Refreshes the access token.
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {string} args.token - The refresh token.
     * @returns {Promise<object>} - The new access token.
     */
    refreshToken: async (_, { token }) => {
      return await authController.refreshToken(token)
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
      return await authController.refreshAccessToken(refreshToken)
    }
  }
}
