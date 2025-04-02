/**
 * @file Defines the ActorModel schema.
 * @module ActorModel
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

// // Application modules.
// import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  // id: {
  //   type: Number,
  //   required: true,
  //   unique: true
  // },
  name: {
    type: String,
    required: true
  },
  movies_played: {
    type: Number,
    required: true
  }
}, {
})

// Add additional schema fields from BASE_SCHEMA.
// schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const ActorModel = mongoose.model('Actor', schema)
