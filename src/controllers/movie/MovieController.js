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
    if (args.genre) filter.genre = args.genre
    if (args.year) filter.release_year = args.year
    return await MovieModel.find(filter)
  }

  /**
   * Get a movie by its ID.
   *
   * @param {string} id - The ID of the movie to fetch.
   * @returns {Promise<object>} - The
   */
  static async getMovieById (id) {
    return await MovieModel.findById(id)
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
    // let idToUse = args.id
    // // If no ID is provided, generate a random one.
    // if (!idToUse) {
    //   let isUnique = false
    //   while (!isUnique) {
    //     const randomId = Math.floor(Math.random() * 1000000)
    //     const existingMovie = await MovieModel.findOne({ id: randomId })

    //     if (!existingMovie) {
    //       idToUse = randomId
    //       isUnique = true
    //     }
    //   }
    // }
    // // const movie = new MovieModel(args)
    // const movie = new MovieModel({
    //   ...args,
    //   id: idToUse
    // })
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
    return await MovieModel.findByIdAndDelete(id)
  }
}
