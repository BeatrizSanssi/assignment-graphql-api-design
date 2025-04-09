/**
 * @file Defines the MovieController class.
 * @module MovieController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { MovieModel } from '../../models/MovieModel.js'
import { UnauthorizedError } from '../../lib/errors/index.js'

/**
 * Encapsulates the movie controller.
 */
export class MovieController {
  /**
   * Get all movies with optional filters (genre, year).
   *
   * @param {object} args - Arguments for filtering the movies.
   * @returns {Promise<object[]>} - A list of movies.
   */
  static async getMovies (args) {
    const filter = {}
    if (args.id) filter.id = args.id
    if (args.genre) filter.genre = args.genre
    if (args.year) filter.release_date = args.year
    return await MovieModel.find(filter)
  }

  /**
   * Get a movie by its ID.
   *
   * @param {string} id - The ID of the movie to fetch.
   * @returns {Promise<object>} - The
   */
  static async getMovieById (id) {
    // If id is an objectId, use findById
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const movieByObjectId = await MovieModel.findById(id)
      if (movieByObjectId) return movieByObjectId
    }
    // If id is a number, use findOne
    const movieByNumberId = await MovieModel.findOne({ id: Number(id) })
    return movieByNumberId
  }
  // static async getMovieById (id) {
  //   // return await MovieModel.findOne({ id: Number(id) })
  //   // return await MovieModel.findOne({ id })
  //   return await MovieModel.findById(id)
  // }

  /**
   * Get movies by IDs.
   *
   * @param {Array<string>} ids - The IDs of the movies.
   * @returns {Promise<object[]>} - A list of movies.
   */
  static async getMoviesByIds (ids) {
    return await MovieModel.find({ id: { $in: ids } })
  }

  /**
   * Adds a new movie.
   *
   * @param {object} args - The movie data.
   * @param {object} user - The logged in user.
   * @returns {Promise<object>} - The added movie.
   */
  static async addMovie (args, user) {
    if (!user) throw new UnauthorizedError('Unauthorized')
    const movie = new MovieModel(args)
    return await movie.save()
  }

  /**
   * Updates a movie.
   *
   * @param {string} id - The ID of the movie to update.
   * @param {object} updateData - The new movie data.
   * @param {object} user - The logged in user.
   * @returns {Promise<object>} - The updated movie.
   */
  static async updateMovie (id, updateData, user) {
    if (!user) throw new UnauthorizedError('Unauthorized')
    return await MovieModel.findByIdAndUpdate(id, updateData, { new: true })
  }

  /**
   * Deletes a movie.
   *
   * @param {string} id - The ID of the movie to delete.
   * @param {object} user - The logged in user.
   * @returns {Promise<object>} - The deleted movie.
   */
  static async deleteMovie (id, user) {
    if (!user) throw new UnauthorizedError('Unauthorized')
    const movie = await MovieModel.findById(id)

    if (!movie) {
      return {
        deletedMovie: null,
        message: 'Movie already deleted or does not exist in the database.'
      }
    }

    await MovieModel.deleteOne({ _id: id })

    return {
      deletedMovie: movie,
      message: 'Movie successfully deleted and is no longer available in the database.'
    }
    // return await MovieModel.findByIdAndDelete(id)
  }
}
