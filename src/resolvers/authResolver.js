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
      return await userController.loginUser({ email, password })
      // try {
      //   const { token, refreshToken } = await userController.loginUser({ email, password })
      //   const user = await UserModel.findOne({ email })
      //   return { token, refreshToken, user }
      // } catch (err) {
      //   // Throw an error if the login fails.
      //   throw new UnauthorizedError(err.message)
      // }
    },
    /**
     * Updates a user.
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {string} args.id - The ID of the user to update.
     * @param {string} args.email - The new email of the user.
     * @param {string} args.password - The new password of the user.
     * @returns {Promise<object>} - The updated user.
     */
    updateUser: async (_, { id, email, password }) => {
      return await userController.updateUser({ id, email, password })
      // const user = await UserModel.findById(id)
      // if (!user) {
      //   throw new UnauthorizedError('User not found')
      // }
      // if (email) {
      //   user.email = email
      // }
      // if (password) {
      //   user.password = password
      // }
      // await user.save()
      // return user
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
      // const user = await UserModel.findById(id)
      // if (!user) {
      //   throw new UnauthorizedError('User not found')
      // }
      // await user.remove()
      // return user
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
      await authController.refreshToken(token)
      // try {
      //   const decoded = jwt.verify(token, process.env.JWT_SECRET)
      //   const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' })
      //   const user = await UserModel.findById(decoded.id)
      //   return { token: newAccessToken, refreshToken: token, user }
      // } catch (err) {
      //   throw new UnauthorizedError('Invalid refresh token')
      // }
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
      await authController.refreshAccessToken(refreshToken)
      //   try {
      //     const payload = jwt.verify(refreshToken, process.env.JWT_SECRET)
      //     const user = await UserModel.findById(payload.id)

      //     if (!user) {
      //       throw new UnauthorizedError('User not found')
      //     }

      //     const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

    //     return { token: newToken }
    //   } catch (err) {
    //     throw new UnauthorizedError('Invalid refresh token')
    //   }
    // }
    }
  }
}
