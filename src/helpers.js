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
 * @example
 * minMax(5) // => 1
 * minMax(-5) // => 0
 * minMax(5, 2) // => 2
 * minMax(-5, 2, -2) // => -2
 * minMax(0.5) // => 0.5
 */
const minMax = (n, max = 1, min = 0) => Math.max(min, Math.min(max, n))

/**
 * Checks if a number is within a bound
 * @param {number} n
 * @param {number} [max=1]
 * @param {number} [min=0]
 * @returns {boolean} returns true if the number is smaller than `max` and bigger than `min`
 * @example
 * inBound(5) // => false
 * inBound(-5) // => false
 * inBound(1) // => false
 * inBound(0) // => false
 * inBound(0.1) // => true
 * inBound(0.9999) // => true
 * inBound(4.9, 5) // => true
 * inBound(-4.9, -5) // => true
 * inBound(10, 10) // => false
 * inBound(-10, -10) // => false
 */
const inBound = (n, max = 1, min = 0) => n > min && n < max

export {
  minMax,
  inBound
}
