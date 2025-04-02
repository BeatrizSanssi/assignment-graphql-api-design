/**
 * @file Defines the rating resolver.
 * @module resolvers/ratingResolver
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { RatingController } from '../controllers/movie/RatingController.js'

export default {
  Query: {
    /**
     * Get all actors.
     *
     * @param {object} _ - The parent object.
     * @param {object} args - The arguments for the query.
     * @param {string} args.movieId - The ID of the movie.
     * @returns {Promise<object[]>} - A list of actors.
     */
    ratings: async (_, { movieId }) => {
      return await RatingController.getRatingsByMovieId(movieId)
    }
  }
}
