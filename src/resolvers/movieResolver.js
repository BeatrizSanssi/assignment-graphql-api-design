/**
 * @file Defines the movie resolver.
 * @module resolvers/movieResolver
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { MovieController } from '../controllers/movie/MovieController.js'
import { ActorController } from '../controllers/movie/ActorController.js'
import { RatingController } from '../controllers/movie/RatingController.js'

export default {
  Query: {
    /**
     * Get all movies with optional filters (genre, year).
     *
     * @param {object} _ - The parent object.
     * @param {object} args - Arguments for filtering the movies.
     * @returns {Promise<object[]>} - A list of movies.
     */
    movies: async (_, args) => {
      return await MovieController.getMovies(args)
    },
    /**
     * Get a movie by its ID.
     *
     * @param {object} _ - The parent object.
     * @param {object} args - The arguments for the query.
     * @param {string} args.id - The ID of the movie to fetch.
     * @returns {Promise<object>} - The movie.
     */
    movie: async (_, { id }) => {
      return await MovieController.getMovieById(id)
    },
    /**
     * Get all actors.
     *
     * @returns {Promise<object[]>} - A list of actors.
     */
    actors: async () => {
      return await ActorController.getAllActors()
    },
    /**
     * Get all ratings.
     *
     * @returns {Promise<object[]>} - A list of ratings.
     */
    ratings: async () => {
      return await RatingController.getAllRatings()
    }
  },
  Mutation: {
    /**
     * Adds a new movie in the database (requires authentication).
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {*} context - The context object.
     * @returns {Promise<object>}  - The added movie.
     */
    addMovie: async (_, args, context) => {
      return await MovieController.addMovie(args, context.user)
    },
    /**
     * Updates a movie in the database (requires authentication).
     *
     * @param {*} _ - The parent object.
     * @param {*} param1 - The arguments for the mutation.
     * @param {*} context - The context object.
     * @returns {Promise<object>} - The updated movie.
     */
    updateMovie: async (_, { id, ...updateData }, context) => {
      return await MovieController.updateMovie(id, updateData, context.user)
    },
    /**
     * Deletes a movie from the database (requires authentication).
     *
     * @param {*} _ - The parent object.
     * @param {*} args - The arguments for the mutation.
     * @param {*} context - The context object.
     * @returns {Promise<object>} - The deleted movie.
     */
    deleteMovie: async (_, { id }, context) => {
      return await MovieController.deleteMovie(id, context.user)
    }
  },
  Movie: {
    /**
     * Field resolver to get all ratings for a movie.
     *
     * @param {object} parent - The parent object.
     * @returns {Promise<object[]>} - A list of ratings.
     */
    ratings: async (parent) => {
      // Use the parent object to get the movie ID
      return await RatingController.getRatingsByMovieId(parent._id)
    }
  }
}
