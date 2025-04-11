/**
 * @file Defines the RatingController class.
 * @module RatingController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { RatingModel } from '../../models/RatingModel.js'
import { ApolloError } from 'apollo-server-errors'

/**
 * Encapsulates the rating controller.
 */
export class RatingController {
  /**
   * Get all ratings.
   *
   * @returns {Promise<object[]>} List with ratings.
   * @throws {ApolloError} If no ratings are found.
   */
  static async getAllRatings () {
    const ratings = await RatingModel.find()

    if (!ratings.length) {
      throw new ApolloError('No ratings found', 'NO_RATINGS_FOUND')
    }

    return ratings
  }

  /**
   * Get all ratings for a specific movie.
   *
   * @param {string} movieId - The movies id.
   * @returns {Promise<object[]>} List with ratings.
   * @throws {ApolloError} If no ratings are found or if the movie ID is invalid.
   */
  static async getRatingsByMovieId (movieId) {
    console.log('Looking for ratings with movieId:', movieId)
    if (!movieId || isNaN(movieId)) {
      throw new ApolloError('Invalid movie ID', 'INVALID_MOVIE_ID', { movieId })
    }

    const ratings = await RatingModel.find({ movieId: Number(movieId) })

    if (!ratings.length) {
      throw new ApolloError('No ratings found for this movie', 'NO_RATINGS_FOR_MOVIE', { movieId })
    }

    return ratings
  }
}
