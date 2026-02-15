/**
 * @file Middleware to require authentication for GraphQL resolvers.
 * @module requireAuth
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { AuthenticationError } from 'apollo-server-express'

/**
 * Checks if the user is authenticated in the GraphQL context, if not, throws an AuthenticationError.
 *
 * @param {object} context - The GraphQL context containing the user information.
 * @throws {AuthenticationError} If the user is not authenticated.
 */
export function requireAuth (context) {
  if (!context.user) {
    throw new AuthenticationError('Authentication required')
  }
}
