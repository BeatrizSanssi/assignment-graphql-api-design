/**
 * @file seed.js
 * @description Script for reading a CSV file and saving its contents to a MongoDB database.
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import dotenv from 'dotenv'
import { connectToDatabase } from './src/config/mongoose.js'
import fs from 'fs'
import csv from 'csv-parser'
import { MovieModel } from './src/models/MovieModel.js'
import { ActorModel } from './src/models/ActorModel.js'
import { RatingModel } from './src/models/RatingModel.js'

dotenv.config()
console.log('Seeding MOVIES_CSV_PATH =', process.env.MOVIES_CSV_PATH)
console.log('Seeding RATINGS_CSV_PATH =', process.env.RATINGS_CSV_PATH)
console.log('Seeding ACTORS_CSV_PATH =', process.env.ACTORS_CSV_PATH)
console.log('Seeding LINKS_CSV_PATH =', process.env.LINKS_CSV_PATH)

/**
 * Parses a CSV file and returns an array of objects.
 *
 * @param {string} filePath - The path to the CSV file.
 * @param {Function} transformRow - A function that transforms a CSV row to a Mongoose object.
 * @returns {Promise<object[]>} - An array of objects.
 */
function parseCSV (filePath, transformRow) {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Call the transformRow function to convert the row to a Mongoose object
        const doc = transformRow(row)
        if (doc) {
          // Push the transformed object to the results array
          results.push(doc)
        }
      })
      // When the CSV file has been read completely (end event)
      .on('end', () => {
        console.log(`Finished reading CSV: ${filePath}. Found ${results.length} rows.`)
        resolve(results)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

/**
 * Parses a cast string and returns an array of actor objects.
 *
 * @param {string} castStr - The cast string.
 * @returns {object[]} - An array of actor objects.
 */
function parseCast (castStr) {
  // Regex to match actor ID and name
  const regex = /'id':\s*(\d+).*?'name':\s*'([^']+)'/g
  const actors = []
  let match
  // Loop through all matches in the cast string
  while ((match = regex.exec(castStr)) !== null) {
    actors.push({
      id: parseInt(match[1]),
      name: match[2]
    })
  }
  return actors
}

/**
 * Counts unique film appearances per actor.
 *
 * @returns {Promise<object[]>} - An array of objects containing actor IDs, names, and film counts.
 */
export async function seedActors () {
  // Read all rows from the credits CSV
  const rows = await parseCSV(process.env.ACTORS_CSV_PATH, (row) => row)
  // Create a Map: key = actor ID, value = { name, movies_played }
  const actorMap = new Map()

  // Iterate through each row (where each row represents a movie)
  for (const row of rows) {
    const movieId = parseInt(row.id)
    if (row.cast) {
      const actors = parseCast(row.cast)
      for (const actor of actors) {
        if (!actorMap.has(actor.id)) {
          actorMap.set(actor.id, {
            id: actor.id,
            name: actor.name,
            movies_played: 0,
            movies: []
          })
        }

        const entry = actorMap.get(actor.id)
        if (!entry.movies.includes(movieId)) {
          entry.movies_played++
          entry.movies.push(movieId)
        }
      }
    }
  }

  const uniqueActors = Array.from(actorMap.values())
  // Delete all existing actors from the database and insert the new ones
  await ActorModel.deleteMany({})
  await ActorModel.insertMany(uniqueActors)
  console.log(`Successfully inserted ${uniqueActors.length} actors into DB.`)
}

/**
 * Main function for seeding the database.
 *
 * @returns {Promise<void>} - A Promise.
 */
export async function seed () {
  try {
    // 1. CONNECT TO DB
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
    console.log('Connected to MongoDB for seeding.')

    // 2. DROP DB TO START FRESH
    await (await import('mongoose')).default.connection.db.dropDatabase()
    console.log('Database dropped before seeding.')

    // 3. PARSE & SEED MOVIES
    const seenMovieIds = new Set()
    const movies = await parseCSV((process.env.MOVIES_CSV_PATH), (row) => {
      const id = parseInt(row.id)

      // Skip duplicates
      if (!id || seenMovieIds.has(id)) return null
      seenMovieIds.add(id)

      // Extract data from each row
      // Titel
      const title = row.title || row.original_title || 'N/A'

      // Release date => release_year
      let releaseYear = 0
      if (row.release_date) {
        const parts = row.release_date.split('-')
        releaseYear = parseInt(parts[0]) || 0
      }

      // Genre => genre
      let genre = 'Unknown' // Default value
      if (row.genres) {
        try {
          const fixedGenresStr = row.genres.replace(/'/g, '"')
          const parsedGenres = JSON.parse(fixedGenresStr)

          if (Array.isArray(parsedGenres) && parsedGenres.length > 0) {
            genre = parsedGenres.map(g => g.name).join(', ')
          }
        } catch (err) {
          console.warn(`Could not parse genre for movie: ${row.title}`, err)
          // If there's an error, just use the default value
        }
      }

      // Overview => description
      const description = row.overview || 'N/A'

      // Create a movie object with the extracted data
      return {
        id,
        title,
        release_date: releaseYear,
        genre,
        description
      }
    })

    // Clear the existing movies from the database
    await MovieModel.deleteMany({})

    // Insert the new movies into the database
    const insertedMovies = await MovieModel.insertMany(movies, { ordered: false })
    console.log(`Inserted ${insertedMovies.length} movies`)

    // 4. Create movieId map
    // const movieIdMap = new Map()
    // insertedMovies.forEach((movie) => {
    //   movieIdMap.set(movie.id, movie._id)
    // })

    // 5. PARSE & SEED ACTORS (from credits.csv)
    await seedActors()

    // 6. PARSE & SEED RATINGS
    const ratingSeed = new Set()
    const ratings = await parseCSV(process.env.RATINGS_CSV_PATH, (row) => {
      const movieId = parseInt(row.movieId)
      const userId = parseInt(row.userId)
      const rating = parseFloat(row.rating)

      // if (!movieIdMap.has(movieId)) {
      //   console.warn(`No match for movieId ${movieId}`)
      //   return null
      // }
      // console.log('Matched rating movieId:', movieId)
      // const key = `${movieId}-${userId}`
      // if (!movieIdMap.has(movieId)) return null
      // if (seenRatings.has(key)) return null
      if (!seenMovieIds.has(movieId)) {
        console.warn(`No match for movieId ${movieId}`)
        return null
      }

      const key = `${movieId}-${userId}`
      if (ratingSeed.has(key)) return null
      ratingSeed.add(key)
      // if (seenRatings.has(key)) {
      //   return null // Skip duplicates
      // }

      // seenRatings.add(key)

      return {
        userId,
        rating,
        movieId
      }
    })
    await RatingModel.deleteMany({})
    await RatingModel.insertMany(ratings, { ordered: false })
    console.log(`Successfully inserted ${ratings.length} ratings into DB.`)
  } catch (error) {
    console.error('Error while seeding:', error)
  } finally {
    // 7. CLOSE DB
    await (await import('mongoose')).default.connection.close()
    console.log('Database connection closed. Seeding complete.')
  }
}

// Execute the seed function
seed()
