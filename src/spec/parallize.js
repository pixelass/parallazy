/**
 * @private
 * @author Gregor Adams <greg@pixelass.com>
 */

import test from 'ava'
import parallize from '../parallize'

/**
 * A simple fake element that has a `getBoundingClientRect` method
 * @param {number} [height=100]
 * @param {number} [width=100]
 * @param {number} [top=100]
 * @param {number} [left=100]
 * @private
 * @returns {object}
 * @example
 * fakeEl()
 * fakeEl(20)
 * fakeEl(300, 300)
 * fakeEl(100, 100, 200)
 * fakeEl(100, 100, 200, 200)
 */
const fakeEl = (height = 100, width = 100, top = 100, left = 100) => ({
  /**
   * Mock function for `element.getBoundingClientRect`
   * @private
   * @returns {object}
   * @example
   * fakeEl().getBoundingClientRect().top // => 100
   * fakeEl().getBoundingClientRect().bottom // => 200
   * fakeEl(300).getBoundingClientRect().bottom // => 400
   */
  getBoundingClientRect() {
    return {
      top,
      right: left + width,
      bottom: top + height,
      left,
      height,
      width
    }
  }
})

/**
 * Fake window
 * @private
 * @type {Object}
 */
global.window = {
  innerWidth: 1000,
  innerHeight: 1000
}

test('parallize is a function', t => {
  t.true(typeof parallize === 'function')
})

test('parallize returns an object', t => {
  t.true(typeof parallize(fakeEl()) === 'object')
})

test('parallize adds progress', t => {
  t.true(parallize(fakeEl()).progressX > 0)
})

test('parallize allows options', t => {
  const el = fakeEl(100, 100, 0, 0)
  const opt1 = parallize(el).progressY
  const opt2 = parallize(el, {entering: false}).progressY
  const opt3 = parallize(el, {entering: false, offsetY: -100}).progressY
  const opt4 = parallize(el, {entering: false, offsetY: -200, decimals: 4}).progressY
  t.true(parseFloat(opt1) === 0.91)
  t.true(parseFloat(opt2) === 1)
  t.true(parseFloat(opt3) === 0.91)
  t.true(parseFloat(opt4) === 0.8462)
})
