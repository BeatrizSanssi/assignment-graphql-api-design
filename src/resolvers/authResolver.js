/**
 * @file Defines the auth resolver.
 * @module resolvers/authResolver
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { userController } from '../controllers/user/UserController.js'
import { UserModel } from '../models/UserModel.js'

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
        const token = await userController.loginUser({ email, password })
        const user = await UserModel.findOne({ email })
        return { token, user }
      } catch (err) {
        // Throw an error if the login fails.
        throw new Error(err.message)
      }
    }
  }
}
