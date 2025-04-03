/**
 * @file Defines the UserController class.
 * @module UserController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { UserModel } from '../../models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UnauthorizedError, NotFoundError } from '../../lib/errors/index.js'

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
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      throw new UnauthorizedError('User already exists')
    }
    const user = new UserModel({ email, password })
    await user.save()
    return user
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
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedError('Wrong credentials')
    }
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new UnauthorizedError('Wrong credentials')
    }
    // Generate and return a JWT token.
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })

    // Generate and return a refresh token.
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })

    return { token, refreshToken }
  }

  /**
   * Updates a user.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {object} param1 - Object with email and password.
   * @param {string} param1.email - The new email of the user.
   * @param {string} param1.password - The new password of the user.
   * @returns {Promise<object>} - The updated user.
   */
  async updateUser (userId, { email, password }) {
    const updateData = {}
    if (email) updateData.email = email
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true })
    if (!updatedUser) throw new NotFoundError('User not found')
    return updatedUser
  }

  /**
   * Deletes a user.
   *
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<boolean>} - True if the user was deleted.
   */
  async deleteUser (userId) {
    const deleted = await UserModel.findByIdAndDelete(userId)
    if (!deleted) throw new NotFoundError('User not found')
    return true
  }
}

export const userController = new UserController()
