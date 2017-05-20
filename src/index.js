/**
 * @file src/index.js
 * @author Gregor Adams <greg@pixelass.com>
 * @module Parallazy
 */

import {requestEventListener} from './event-listeners'
import {inBound, minMax, isCallback} from './helpers'
import parallize from './parallize'

/**
 * Global name of the jQuery plugin. This is to call the plugin.
 * @memberof module:Parallazy
 * @type {string}
 */
const PLUGIN_NAME = 'Parallazy'

/**
 * Default options for plugin instances
 * @memberof module:Parallazy
 * @prop {object} classNames
 * @prop {string} classNames.visibleX
 * @prop {string} classNames.visibleY
 * @prop {string} classNames.pluginLoaded
 * @prop {boolean} entering
 * @prop {object} offset
 * @prop {number} offset.top
 * @prop {number} offset.right
 * @prop {number} offset.bottom
 * @prop {number} offset.left
 * @prop {number} decimals
 * @prop {array.<string>} events
 * @prop {function|null} onProgress
 * @prop {function|null} onTop
 * @prop {function|null} onRight
 * @prop {function|null} onBottom
 * @prop {function|null} onLeft
 */
const PLUGIN_DEFAULTS = {
  classNames: {
    visibleX: 'visible-x',
    visibleY: 'visible-y',
    pluginLoaded: 'pluginLoaded'
  },
  entering: true,
  offset: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  decimals: 10,
  events: ['scroll', 'resize'],
  onProgress: null,
  onTop: null,
  onRight: null,
  onBottom: null,
  onLeft: null
}

class Parallazy {
  /**
   * Parallazy is lazy parallax plugin,
   * @memberof module:Parallazy
   * @param {object} [options={}]
   * @returns {this}
   * @example
   * // import module from node_modules
   * import Parallazy from 'parallazy'
   *
   * // Get all elements as an array
   * const elements = Array.from(document.querySelectorAll('.parallazy'))
   *
   * // Create an Array of instances
   * elements.map(el => {
   *   const parallazy = new Parallazy()
   * })
   *
   * // Create an Array of instances,
   * // with custom configuration
   * elements.map(el => {
   *   const parallazy = new Parallazy({
   *     classNames: {
   *       visibleX: styles.visibleX,
   *       visibleY: styles.visibleY,
   *       pluginLoaded: styles.pluginLoaded
   *     },
   *     decimals: 4,
   *     entering: false,
   *     offset: {
   *       top: 50,
   *       left: 80.
   *       bottom: 100,
   *       right: 200
   *     },
   *     onProgress(p) {
   *       el.style.setProperty('--progress-y', p.top)
   *     },
   *     onTop() {
   *       el.style.setProperty('--progress-y', 1)
   *     },
   *     onBottom() {
   *       el.style.setProperty('--progress-y', 0)
   *     }
   *   })
   * })
   */
  constructor(options = {}) {
    this.options = {...PLUGIN_DEFAULTS, ...options}
    return this.methods
  }

  /**
   * Public methods.
   * @memberof module:Parallazy
   * @type {getter}
   * @returns {object}
   * @example
   * const methods = this.methods
   */
  get methods() {
    return {
      init: this.init.bind(this),
      destroy: this.destroy.bind(this)
    }
  }

  /**
   * Initialize plugin
   * @memberof module:Parallazy
   * @type {method}
   * @param {HTMLElement} el
   * @example
   * const parallazy = new Parallazy()
   * parallazy.init(document.querySelector('.parallazy'))
   */
  init(el) {
    const {pluginLoaded} = this.options.classNames
    this.el = el
    el.classList.add(pluginLoaded)
    this.onInit(el)
  }

  /**
   * Destroys the instance. Reverts all changes that have been made to the DOM.
   * Also removes all event Listeners.
   * Removes all event listeners and element class names.
   * @memberof module:Parallazy
   * @type {method}
   * @example
   * const parallazy = new Parallazy()
   * parallazy.init(document.querySelector('.parallazy'))
   * parallazy.destroy()
   */
  destroy() {
    // Get all classNames from the options and put them in an array,
    // to allow batch removal
    const {classNames} = this.options
    const classes = Object.keys(classNames).map(key => classNames[key])

    this.options.events.forEach(event => {
      this[`cancel_${event}`]()
    })
    this.el.classList.remove(...classes)
  }

  /**
   * Callback ofter plugin instance has been initialized
   * @memberof module:Parallazy
   * @type {method}
   * @private
   * @example
   * this.onInit()
   */
  onInit() {
    // Create namespaced eventnames
    const progress = parallize(this.el, {
      offset: this.options.offset,
      entering: this.options.entering,
      decimals: this.options.decimals
    })

    // Add global event listeners for a set of events
    this.options.events.forEach(event => {
      this[`cancel_${event}`] = requestEventListener(event, () => {
        this.checkForItems()
          .then(this.handleProgress.bind(this))
          .catch(err => err)
      })
    })
    this.handleProgress(progress)
  }

  /**
   * Handle progress of element
   * @param {object} progress
   * @private
   * @type {method}
   * @example
   * this.handleProgress({top: 0, left: 0.3, right: 0.7, bottom 1})
   */
  handleProgress(progress) {
    const {decimals} = this.options
    const decimalBound = (1 / (Math.pow(10, decimals)))
    const min = -1 * decimalBound
    const max = 1 + decimalBound
    const bound = {
      x: inBound(progress.right, max, min),
      y: inBound(progress.bottom, max, min)
    }
    this.currentClasses(bound)
    if (isCallback(this.options.onProgress) && (bound.x && bound.y)) {
      this.options.onProgress({
        top: minMax(progress.top),
        right: minMax(progress.right),
        bottom: minMax(progress.bottom),
        left: minMax(progress.left)
      })
    } else if (bound.x) {
      if (isCallback(this.options.onTop) && (progress.top > 1)) {
        this.options.onTop()
      } else if (isCallback(this.options.onBottom) && (progress.top < 0)) {
        this.options.onBottom()
      }
    } else if (bound.y) {
      if (isCallback(this.options.onLeft) && (progress.left > 1)) {
        this.options.onLeft()
      } else if (isCallback(this.options.onRight) && (progress.left < 0)) {
        this.options.onRight()
      }
    }
  }

  /**
   * Add live classNames. Adds `visibleX` and/or `visibleX` class depending on the visibility
   * @memberof module:Parallazy
   * @private
   * @type {method}
   * @param {HTMLElement} el
   * @param {object} visible
   * @example
   * this.currentClasses(this.el, {x: true, y: false})
   */
  currentClasses({x, y}) {
    const {visibleX, visibleY} = this.options.classNames
    this.el.classList.toggle(visibleX, x)
    this.el.classList.toggle(visibleY, y)
  }

  /**
   * Checks if an item matches the required criteria to be visible
   * @memberof module:Parallazy
   * @private
   * @type {method}
   * @returns {promise}
   * @example
   * this.checkForItems(this.el)
   */
  checkForItems() {
    return new Promise((resolve, reject) => {
      const progress = parallize(this.el, {
        offset: this.options.offset,
        entering: this.options.entering,
        decimals: this.options.decimals
      })
      if (progress) {
        return resolve(progress)
      }
      return reject(new Error('progress should be an object.'))
    })
  }
}

export {PLUGIN_NAME}
export default Parallazy
