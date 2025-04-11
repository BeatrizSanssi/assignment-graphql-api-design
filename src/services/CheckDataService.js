/**
 * @file Defines the GraphQL api service.
 * @module CheckDataService
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { CheckDataClientFactory } from '../utils/CheckDataClientFactory.js'

/**
 * Service for interacting with the GraphQL API.
 */
export class CheckDataService {
  /**
   * Fetches data from the GraphQL API.
   *
   * @param {string} endpoint - The API endpoint to fetch data from.
   * @param {object} params - The parameters to include in the request.
   * @returns {Promise<object>} - The response data from the API.
   */
  static async fetchData (endpoint, params) {
    const client = CheckDataClientFactory.createGraphQLApiClient()
    try {
      const response = await client.post('/graphql', {
        query: `
        query {
          movies {
            id
            title
          }
        }
      `
      })
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error.message)
      throw error
    }
  }
}
