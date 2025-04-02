import 'dotenv/config'
import mongoose from 'mongoose'
import { connectToDatabase } from '../src/config/mongoose.js'
import { UserModel } from '../src/models/UserModel.js'

/**
 * Cleans up test users from the database.
 * This script should be run after tests to remove any test data.
 * It connects to the database, deletes test users, and then exits.
 */
async function cleanupTestData () {
  try {
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
    console.log('Connected to test database for cleanup')

    // Cleanup any existing test users
    const deleted = await UserModel.deleteMany({ email: /testuser\d+@test\.com/ })
    console.log(`Cleaned ${deleted.deletedCount} test users.`)
  } catch (err) {
    console.error('Error in cleanup test db:', err)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('Database connection closed.')
  }
}
cleanupTestData()
