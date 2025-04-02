// /**
//  * @file Middleware to set user data in res.locals.
//  * @module setUserLocals
//  * @author Beatriz Sanssi <bs222eh@student.lnu.se>
//  */

// /**
//  * Middleware to attach user data to res.locals for use in views.
//  *
//  * @param {object} req - Express request object.
//  * @param {object} res - Express response object.
//  * @param {Function} next - Express next middleware function.
//  * @returns {void}
//  */
// export function setUserLocals (req, res, next) {
//   req.user = req.session.user
//   console.log('Setting user data in res.locals...')
//   if (req.user) {
//     console.log('User found in req:', req.user)
//     res.locals.user = {
//       id: req.user.id,
//       // name: req.user.name,
//       email: req.user.email
//     }
//   } else {
//     console.error('No user found in req!')
//     res.locals.user = null
//   }
//   next()
// }

// export default { setUserLocals }
