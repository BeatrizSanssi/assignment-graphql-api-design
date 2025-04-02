/**
 * @file This file merges all the .graphql files in the schema folder into one typeDefs object.
 * @module schema/index
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load all .graphql files in the schema folder.
const typesArray = loadFilesSync(path.join(__dirname, '*.graphql'))
export const typeDefs = mergeTypeDefs(typesArray)
