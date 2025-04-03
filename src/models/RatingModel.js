/**
 * @file Defines the RatingModel schema.
 * @module RatingModel
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  // movieId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Movie',
  //   required: true
  // },
  userId: { type: Number, required: true },
  movieId: { type: Number, required: true },
  rating: { type: Number, required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
})

// Create a model using the schema.
export const RatingModel = mongoose.model('Rating', schema)
