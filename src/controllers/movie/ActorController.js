/**
 * @file Defines the ActorController class.
 * @module ActorController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { ActorModel } from '../../models/ActorModel.js'
import { MovieController } from './MovieController.js'

/**
 * Encapsulates the actor controller.
 */
export class ActorController {
  /**
   * Get all actors.
   *
   * @param {number} limit - The maximum number of actors to return.
   * @returns {Promise<object[]>} - A list of actors.
   */
  static async getAllActors (limit) {
    const query = ActorModel.find()
    if (limit) query.limit(limit)
    return await query.exec()
    // return await ActorModel.find({})
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

  /**
   * Get movies by IDs.
   *
   * @param {Array<string>} ids - The IDs of the movies.
   * @returns {Promise<object[]>} - A list of movies.
   */
  static async getMoviesByIds (ids) {
    return await MovieController.getMoviesByIds(ids)
  }
}
