/**
 * @file Defines the user model.
 * @module models/UserModel
 * @author Mats Loock & Beatriz Sanssi
 * @version 3.0.0
 */

import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
// import validator from 'validator'
// import { BASE_SCHEMA } from './baseSchema.js'

// const { isEmail } = validator

// Create a schema.
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
    lowercase: true,
    trim: true
    // validate: [isEmail, 'Please provide a valid email address.']
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minLength: [10, 'The password must be of minimum length 10 characters.'],
    maxLength: [256, 'The password must be of maximum length 256 characters.']
  }
})

// Salts and hashes password before save.
schema.pre('save', async function () {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
  this.password = await bcrypt.hash(this.password, saltRounds)
})

// Create a model using the schema.
export const UserModel = mongoose.model('User', schema)
