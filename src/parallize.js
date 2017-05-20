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
 * @returns {object} `{top: [0...1], left: [0...1], right: [0...1], bottom: [0...1]}`
 * @type {function}
 * @example
 * const el = document.querySelector('.test')
 * parallize(el)
 * parallize(el, {
 *   entering: false
 * })
 * parallize(el, {
 *   offsetX: 10,
 *   offsetY: 100
 * })
 * parallize(el, {
 *   decimals: 10
 * })
 */
const parallize = (element, options = {}) => {
  const settings = {
    entering: true,
    offset: {},
    decimals: 2,
    ...options
  }
  const offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...settings.offset
  }
  const {top, left, height, width} = element.getBoundingClientRect()
  const {innerHeight, innerWidth} = window
  const bound = {
    left: left - offset.left,
    top: top - offset.top,
    width: innerWidth - (offset.left + offset.right),
    height: innerHeight - (offset.top + offset.bottom)
  }
  let x = 0
  let y = 0
  // Different behaviour when tracking while entering and leaving.
  // If false tracking only happens if the element is fully visible.
  // Both versions respect the offset.
  if (settings.entering) {
    x = (bound.left + width) / (bound.width + width)
    y = (bound.top + height) / (bound.height + height)
  } else {
    x = bound.left / (bound.width - width)
    y = bound.top / (bound.height - height)
  }
  // Create values from relative to y and x
  // 0 => y === 0
  // 0.5 => y === 50%
  // 1 => y === 100%
  // ...
  const progress = {
    x: minMax(x),
    y: minMax(y)
  }
  // Return a value vor every direction
  return {
    top: (1 - progress.y).toFixed(settings.decimals),
    right: (progress.x).toFixed(settings.decimals),
    bottom: (progress.y).toFixed(settings.decimals),
    left: (1 - progress.x).toFixed(settings.decimals)
  }
}

export default parallize
