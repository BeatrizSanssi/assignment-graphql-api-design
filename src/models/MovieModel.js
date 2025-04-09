/**
 * @file Defines the MovieModel schema.
 * @module MovieModel
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
    // /**
    //  * Generates a random number between 100000 and 999999.
    //  *
    //  * @returns {number} A random number between 100000 and 999999.
    //  */
    // default: () => Math.floor(100000 + Math.random() * 900000)
  },
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
  },
  actors: {
    type: [Number],
    default: []
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
})

// Create a model using the schema.
export const MovieModel = mongoose.model('Movie', schema)
