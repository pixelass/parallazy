/**
 * Small helper library.
 * @file src/heplers.js
 * @module helpers
 * @author Gregor Adams <greg@pixelass.com>
 */

/**
 * returns a number bound to a min and max value
 * @param {number} n
 * @param {number} [max=1]
 * @param {number} [min=0]
 * @returns {number} returns a number from `min` to `max`
 */
const minMax = (n, max = 1, min = 0) => Math.max(min, Math.min(max, n))

/**
 * Checks if a number is within a bound
 * @param {number} n
 * @param {number} [max=1]
 * @param {number} [min=0]
 * @returns {boolean} returns true if the number is smaller than `max` and bigger than `min`
 */
const inBound = (n, max = 1, min = 0) => n > min && n < max

export {
  minMax,
  inBound
}
