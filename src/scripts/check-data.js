/**
 * @file Checks if the data is present in the database.
 * @module check-data
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */
import { CheckDataService } from '../services/CheckDataService.js'

/**
 * Checks if the data is present in the database.
 */
async function runCheck () {
  try {
    const data = await CheckDataService.fetchData()
    console.log('Data fetched:', JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Check failed:', err.message)
  }
}

runCheck()
