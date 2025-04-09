/**
 * @file Defines the actor resolver.
 * @module resolvers/actorResolver
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { ActorController } from '../controllers/movie/ActorController.js'

export default {
  Query: {
    /**
     * Get all actors.
     *
     * @returns {Promise<object[]>} - A list of actors.
     */
    // actors: async (_, args) => {
    //   return await ActorController.getAllActors(args.limit)
    // }
    actors: async () => {
      return await ActorController.getAllActors()
    }
  },
  Actor: {
    /**
     * Get all the movie an actor has starred in.
     *
     * @param {object} parent - The parent object.
     * @returns {Promise<object>} - The actor.
     */
    movies: async (parent) => {
      return await ActorController.getMoviesByIds(parent.movies)
    }
  }
}
