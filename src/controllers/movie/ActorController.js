/**
 * @file Defines the ActorController class.
 * @module ActorController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { ActorModel } from '../../models/ActorModel.js'

/**
 * Encapsulates the actor controller.
 */
export class ActorController {
  /**
   * Get all actors.
   *
   * @returns {Promise<object[]>} - A list of actors.
   */
  static async getAllActors () {
    return await ActorModel.find({})
  }

  /**
   * Get an actor by the movie ID.
   *
   * @param {string} movieId - The ID of the movie.
   * @returns {Promise<object>} - The actor.
   */
  static async getActorsByMovieId (movieId) {
    return await ActorModel.find({ movies: movieId })
  }
}
