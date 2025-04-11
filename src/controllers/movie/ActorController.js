/**
 * @file Defines the ActorController class.
 * @module ActorController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { ActorModel } from '../../models/ActorModel.js'
import { MovieController } from './MovieController.js'
import { ApolloError } from 'apollo-server-errors'

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
    const actors = await query.exec()

    if (!actors.length) {
      throw new ApolloError('No actors found', 'NO_ACTORS_FOUND')
    }

    return actors
    // return await query.exec()
    // return await ActorModel.find({})
  }

  /**
   * Get an actor by the movie ID.
   *
   * @param {string} movieId - The ID of the movie.
   * @returns {Promise<object>} - The actor.
   */
  static async getActorsByMovieId (movieId) {
    const actors = await ActorModel.find({ movies: movieId })

    if (!actors.length) {
      throw new ApolloError('No actors found for this movie', 'NO_ACTORS_FOR_MOVIE', { movieId })
    }

    return actors
    // return await ActorModel.find({ movies: movieId })
  }

  /**
   * Get movies by IDs.
   *
   * @param {Array<string>} ids - The IDs of the movies.
   * @returns {Promise<object[]>} - A list of movies.
   */
  static async getMoviesByIds (ids) {
    if (!ids?.length) {
      throw new ApolloError('No movie IDs provided', 'NO_IDS_PROVIDED')
    }

    const movies = await MovieController.getMoviesByIds(ids)
    if (!movies.length) {
      throw new ApolloError('No movies found for these IDs', 'NO_MOVIES_FOUND', { ids })
    }

    return movies
    // return await MovieController.getMoviesByIds(ids)
  }
}
