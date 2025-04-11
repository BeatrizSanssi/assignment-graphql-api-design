/**
 * @file Defines APIClientFactory for creating API clients.
 * @module CheckDataClientFactory
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Factory for creating API clients.
 */
export class CheckDataClientFactory {
  /**
   * Creates a client for the deployed API (e.g., in CI/CD).
   *
   * @returns {object} - A configured axios instance.
   */
  static createProductionGraphQLApiClient () {
    return axios.create({
      baseURL: process.env.PRODUCTION_GRAPHQL_API || 'https://cscloud6-136.lnu.se/graphql-api',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
