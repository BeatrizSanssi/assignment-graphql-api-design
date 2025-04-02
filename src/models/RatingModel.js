/**
 * @file Defines the RatingModel schema.
 * @module RatingModel
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
  // text: {
  //   type: String,
  //   required: true
  // },
  // movie: {
  //   type: String,
  //   required: true
  // }
  userId: { type: Number, required: true },
  // movieId: { type: Number, required: true },
  rating: { type: Number, required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
})

// Add additional schema fields from BASE_SCHEMA.
// schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const RatingModel = mongoose.model('Rating', schema)
