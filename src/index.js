/**
 * @file src/index.js
 * @author Gregor Adams <greg@pixelass.com>
 * @module Parallazy
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

  /**
   * Callback function
   * @param {HTMLelement} element
   * @param {number} progress
   * @returns {any}
   * @example
   * onProgress(element, progress) {
   *   el.setAttribute('data-progress-y', progress.progressY)
   *   el.setAttribute('data-progress-x', progress.progressX)
   * }
   */
  onProgress(element, progress) {
    return {element, progress}
  }
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
   * @param {HTMLElement} el
   * @example
   * this.onInit(this.el)
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
   * @example
   * this.handleProgress({progressX: 0, progressY: 0.3})
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
   * @param {object} visible
   * @example
   * this.currentClasses(this.el, {x: true, y: false})
   */
  currentClasses(el, visible) {
    const {visibleX, visibleY} = this.options.classNames
    el.classList.toggle(visibleX, visible.x)
    el.classList.toggle(visibleY, visible.y)
  }

  /**
   * Checks if an item matches the required criteria to be visible
   * @memberof module:Parallazy
   * @private
   * @type {method}
   * @param {HTMLElement} el
   * @returns {promise}
   * @example
   * this.checkForItems(this.el)
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
