/**
 * @file Defines the ActorController class.
 * @module ActorController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { ActorModel } from '../../models/ActorModel.js'

/**
 * Encapsulates the actor controller.
 */
export class ActorController {
  /**
   * Get all actors.
   *
   * @returns {Promise<object[]>} - A list of actors.
   */
  static async getAllActors () {
    return await ActorModel.find({})
  }
}
