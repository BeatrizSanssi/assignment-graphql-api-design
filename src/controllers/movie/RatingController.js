/**
 * @file Defines the RatingController class.
 * @module RatingController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { RatingModel } from '../../models/RatingModel.js'

/**
 * Encapsulates the rating controller.
 */
export class RatingController {
  /**
   * Get all ratings.
   *
   * @returns {Promise<object[]>} Lista med betyg.
   */
  static async getAllRatings () {
    return await RatingModel.find()
  }

  /**
   * Get all ratings for a specific movie.
   *
   * @param {string} movieId - Filmens ID.
   * @returns {Promise<object[]>} Lista med betyg.
   */
  static async getRatingsByMovieId (movieId) {
    console.log('Looking for ratings with movieId:', movieId)
    return await RatingModel.find({ movieId })
  }
}
