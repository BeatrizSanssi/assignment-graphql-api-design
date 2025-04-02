import 'dotenv/config'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { UserModel } from '../src/models/UserModel.js'
import { userController } from '../src/controllers/user/UserController.js'

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/graphql-api-db'
const testUser = {
  email: `testuser${Date.now()}@test.com`,
  password: 'SuperSecurePassword123!'
}

/**
 * Saves the JWT token to Postman's environment.json file.
 * This function reads the environment file, updates the authToken variable,
 * and writes the updated data back to the file.
 *
 * @param {string} token - The JWT token to save.
 */
const saveTokenToPostmanEnv = (token) => {
  const envPath = path.resolve('tests/environment.json')
  const envData = JSON.parse(fs.readFileSync(envPath, 'utf-8'))

  // Update the authToken variable
  const tokenVar = envData.values.find(v => v.key === 'authToken')
  if (tokenVar) {
    tokenVar.value = token
  } else {
    envData.values.push({ key: 'authToken', value: token, enabled: true })
  }

  fs.writeFileSync(envPath, JSON.stringify(envData, null, 2))
  console.log('JWT token saved to Postman environment.json file')
}

/**
 * Seeds the test database with a test user.
 * This script should be run before tests to ensure a clean state.
 * It connects to the database, creates a test user, and then exits.
 */
async function seedTestData () {
  try {
    await mongoose.connect(DB_CONNECTION_STRING)
    console.log('Connected to test database')

    // Cleanup any existing test users
    await UserModel.deleteMany({ email: /testuser\d+@test\.com/ })

    // 1. Create a test user
    const newUser = await userController.registerUser(testUser)
    console.log(`Created a test user: ${newUser.email}`)

    // 2. Login the test user to get a JWT token
    const token = await userController.loginUser(testUser)
    console.log(`Token recieved: ${token.slice(0, 20)}...`)

    // 3. Save the token to Postman's environment.json file
    saveTokenToPostmanEnv(token)
  } catch (err) {
    console.error('Error in seed test db:', err)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('Database connection closed.')
  }
}
seedTestData()
