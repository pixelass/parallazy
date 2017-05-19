/* global window */
/**
 * @file src/parallize.js
 * @module parallize
 * @module parallize
 * @author Gregor Adams <greg@pixelass.com>
 */

import {minMax} from './helpers'

/**
 * Checks visibility of element in viewport and returns offset as numbers.
 * @param {HTMLElement} element
 * @param {object} options
 * @param {boolean} options.entering track while entering and leaving
 * @param {number} options.offsetX bounding box-x on viewPort
 * @param {number} options.offsetY bounding box-y on viewPort
 * @param {number} options.decimals number of decimals to return
 * @returns {object} `{progressX: [0...1], progressY: [0...1]}`
 * @type {function}
 * @example
 * const el = document.querySelector('.test')
 * const {progressX, progressY} = parallize(el)
 * const {progressX, progressY} = parallize(el, {
 *   entering: false
 * })
 * const {progressX, progressY} = parallize(el, {
 *   offsetX: 10,
 *   offsetY: 100
 * })
 * const {progressX, progressY} = parallize(el, {
 *   decimals: 10
 * })
 */
const parallize = (element, options = {}) => {
  const settings = {
    entering: true,
    offsetX: 0,
    offsetY: 0,
    decimals: 2,
    ...options
  }
  const {top, left, height, width} = element.getBoundingClientRect()
  const {innerHeight, innerWidth} = window
  const lO = left - settings.offsetX
  const tO = top - settings.offsetY
  const wO = innerWidth - (settings.offsetX * 2)
  const hO = innerHeight - (settings.offsetY * 2)
  let x = 0
  let y = 0
  // Different behaviour when tracking while entering and leaving.
  // If false tracking only happens if the element is fully visible.
  // Both versions respect the offset.
  if (settings.entering) {
    x = (lO + width) / (wO + width)
    y = (tO + height) / (hO + height)
  } else {
    x = lO / (wO - width)
    y = tO / (hO - height)
  }
  // Return values from relative to bottom and right
  // 0 => bottom === 0
  // 0.5 => bottom === 50%
  // 1 => bottom === 100%
  // ...
  return {
    progressY: (1 - minMax(y)).toFixed(settings.decimals),
    progressX: (1 - minMax(x)).toFixed(settings.decimals)
  }
}

export default parallize
