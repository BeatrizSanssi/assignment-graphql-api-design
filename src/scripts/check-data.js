/**
 * @file Checks if the data is present in the database.
 * @module check-data
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */
import { CheckDataService } from './services/CheckDataService.js'

/**
 * Checks if the data is present in the database.
 */
async function runCheck () {
  try {
    const data = await CheckDataService.fetchData('/graphql', { id: 123 })
    console.log('Data fetched:', data)
  } catch (err) {
    console.error('Check failed:', err.message)
  }
}

runCheck()
