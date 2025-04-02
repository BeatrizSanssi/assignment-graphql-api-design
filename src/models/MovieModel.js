/**
 * @file Defines the MovieModel schema.
 * @module MovieModel
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

// Application modules.
// import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  // id: {
  //   type: Number,
  //   required: true,
  //   unique: true
  // },
  title: {
    type: String,
    required: true
  },
  release_date: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  // timestamps: true // Adds createdAt and updatedAt automatically
})

// Add additional schema fields from BASE_SCHEMA.
// schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const MovieModel = mongoose.model('Movie', schema)
