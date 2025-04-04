/**
 * @file Defines the ActorModel schema.
 * @module ActorModel
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  movies_played: {
    type: Number,
    required: true
  },
  movies: [Number]
}, {
})

// Create a model using the schema.
export const ActorModel = mongoose.model('Actor', schema)
