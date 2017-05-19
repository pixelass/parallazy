/**
 * @file src/index.js
 * @author Gregor Adams <greg@pixelass.com>
 * @module Parallazy
 * @example
 * // import module from node_modules
 * import Parallazy from 'parallazy'
 *
 * // Get all elements as an array
 * const elements = Array.from(document.querySelectorAll('.parallazy'))
 *
 * // Create an Array of initialized instances
 * const parallazies = elements.map(el => {
 *   const parallazy = new Parallazy()
 *   parallazy.init(el)
 *   return parallazy
 * })
 *
 * // Create an Array of initialized instances,
 * // with custom configuration
 * const parallazies = elements.map(el => {
 *   // configure instance
 *   const parallazy = new Parallazy({
 *     classNames: {
 *       visibleX: styles.visibleX,
 *       visibleY: styles.visibleY,
 *       initiallyVisible: styles.initiallyVisible,
 *       pluginLoaded: styles.pluginLoaded
 *     },
 *     decimals: 2,
 *     entering: false,
 *     offsetX: 100,
 *     offsetY: 20,
 *     onProgress(el, p) {
 *       el.style.setProperty('--progress-y', p.progressY)
 *     }
 *   })
 *   // initialize instance
 *   parallazy.init(el)
 *   return parallazy
 * })
 *
 * // Destroy instances.
 * // create instance (with settings)
 * const parallazy = new Parallazy()
 * // Initialize instance.
 * parallazy.init(document.querySelector('.parallazy'))
 * // Destroy instance.
 * parallazy.destroy()
 */

import {requestEventListener} from './event-listeners'
import {inBound} from './helpers'
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
 */
const PLUGIN_DEFAULTS = {
  classNames: {
    visibleX: 'visible-x',
    visibleY: 'visible-y',
    pluginLoaded: 'peekabooLoaded'
  },
  entering: true,
  offsetX: 0,
  offsetY: 0,
  decimals: 10,
  events: ['scroll', 'resize'],
  onProgress() {}
}

class Parallazy {
  /**
   * Parallazy is lazy parallax plugin,
   * @memberof module:Parallazy
   * @param {object} [options={}]
   * @returns {this}
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
   * @param {HTMLElement} el
   */
  onInit(el) {
    // Create namespaced eventnames
    const progress = parallize(el, {
      offsetX: this.options.offsetX,
      offsetY: this.options.offsetY,
      entering: this.options.entering,
      decimals: this.options.decimals
    })

    // Add global event listeners for a set of events
    this.options.events.forEach(event => {
      this[`cancel_${event}`] = requestEventListener(event, () => {
        this.checkForItems(el)
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
   */
  handleProgress(progress) {
    this.currentClasses(this.el, {
      x: inBound(progress.progressX),
      y: inBound(progress.progressY)
    })
    this.options.onProgress(this.el, progress)
  }

  /**
   * Add live classNames. Adds `visibleX` and/or `visibleX` class depending on the visibility
   * @memberof module:Parallazy
   * @private
   * @type {method}
   * @param {HTMLElement} el
   * @param {boolean} visible
   */
  currentClasses(element, visible) {
    const {visibleX, visibleY} = this.options.classNames
    element.classList.toggle(visibleX, visible.x)
    element.classList.toggle(visibleY, visible.y)
  }

  /**
   * Checks if an item matches the required criteria to be visible
   * @memberof module:Parallazy
   * @private
   * @type {method}
   * @param {HTMLElement} el
   * @returns {promise}
   */
  checkForItems(el) {
    return new Promise((resolve, reject) => {
      const progress = parallize(el, {
        offsetX: this.options.offsetX,
        offsetY: this.options.offsetY,
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
