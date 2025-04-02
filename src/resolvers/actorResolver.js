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
    actors: async () => {
      return await ActorController.getAllActors()
    }
  }
}
