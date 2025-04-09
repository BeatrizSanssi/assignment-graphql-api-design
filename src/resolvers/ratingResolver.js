/**
 * @file Defines the rating resolver.
 * @module resolvers/ratingResolver
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { RatingController } from '../controllers/movie/RatingController.js'

export default {
  Query: {

    /**
     * Get ratings by movie ID.
     *
     * @param {object} _ - The parent object.
     * @param {object} args - The arguments for the query.
     * @param {string} args.movieId - The ID of the movie.
     * @returns {Promise<object[]>} - A list of ratings.
     */
    ratings: async (_, args) => {
      if (args.movieId) {
        return await RatingController.getRatingsByMovieId(args.movieId)
      }
      return await RatingController.getAllRatings()
    }
  }
}
