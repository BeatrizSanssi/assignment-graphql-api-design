/**
 * @file Defines the index resolver.
 * @module resolvers/index
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import movieResolver from './movieResolver.js'
import authResolver from './authResolver.js'
import actorResolver from './actorResolver.js'
import ratingResolver from './ratingResolver.js'

export default {
  Query: {
    ...movieResolver.Query,
    ...authResolver.Query,
    ...actorResolver.Query,
    ...ratingResolver.Query
  },
  Mutation: {
    ...movieResolver.Mutation,
    ...authResolver.Mutation
  }
  // // Ev. field resolvers, t.ex. Movie
  // Movie: {
  //   ...movieResolver.Movie
  // }
}
