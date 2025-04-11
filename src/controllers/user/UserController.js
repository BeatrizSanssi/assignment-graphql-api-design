/**
 * @file Defines the UserController class.
 * @module UserController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { UserModel } from '../../models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// import { UnauthorizedError, NotFoundError } from '../../lib/errors/index.js'
import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-errors'

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Registers a new user.
   *
   * @param {*} param0 - Object with email and password.
   * @returns {object} - The new user
   */
  async registerUser ({ email, password }) {
    try {
      const existingUser = await UserModel.findOne({ email })
      if (existingUser) {
        throw new ApolloError('User already exists', 'USER_EXISTS', { email })
        // throw new UnauthorizedError('User already exists')
      }
      const user = new UserModel({ email, password })
      await user.save()
      return user
    } catch (err) {
      throw new UserInputError('Registration failed', {
        error: err.message
      })
      // throw new UnauthorizedError(err.message)
    }
  }

  /**
   * Logs in a user.
   *
   * @param {object} param0 - Object with email and password.
   * @param {string} param0.email - The email of the user.
   * @param {string} param0.password - The password of the user.
   * @returns {Promise<string>} JWT-token if login is successful.
   */
  async loginUser ({ email, password }) {
    try {
      const user = await UserModel.findOne({ email })
      if (!user) {
        throw new AuthenticationError('Wrong credentials')
        // throw new UnauthorizedError('Wrong credentials')
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        throw new AuthenticationError('Wrong credentials')
        // throw new UnauthorizedError('Wrong credentials')
      }
      // Generate and return a JWT token.
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })

      // Generate and return a refresh token.
      const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })

      return { token, refreshToken }
    } catch (err) {
      // Throw an error if the login fails.
      throw new AuthenticationError('Wrong credentials')
      // throw new UnauthorizedError(err.message)
    }
  }

  /**
   * Updates a user.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {object} param1 - Object with email and password.
   * @param {string} param1.email - The new email of the user.
   * @returns {Promise<object>} - The updated user.
   */
  async updateUser (userId, { email }) {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new ApolloError('User not found', 'USER_NOT_FOUND', { userId })
      // throw new NotFoundError('User not found')
    }

    // Prepare the data to update.
    const updateData = {}
    if (email) {
      updateData.email = email
    }

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true })
      if (!updatedUser) {
        throw new ApolloError('Update failed – user not found', 'USER_NOT_FOUND')
        // throw new NotFoundError('User not found')
      }
      return updatedUser
    } catch (err) {
      throw new ApolloError('Failed to update user', 'UPDATE_FAILED', {
        userId,
        message: err.message
      })
      // throw new UnauthorizedError(err.message)
    }
  }

  /**
   * Deletes a user.
   *
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<boolean>} - True if the user was deleted.
   */
  async deleteUser (userId) {
    try {
      const deleted = await UserModel.findByIdAndDelete(userId)

      if (!deleted) {
        throw new ApolloError('User not found', 'USER_NOT_FOUND', { userId })
      }
      // if (!deleted) throw new NotFoundError('User not found')
      return { id: deleted._id.toString(), email: deleted.email }
    } catch (err) {
      throw new ApolloError('Failed to delete user', 'DELETE_FAILED', {
        userId,
        message: err.message
      })
      // throw new UnauthorizedError(err.message)
    }
  }
}

export const userController = new UserController()
