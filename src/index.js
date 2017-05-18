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
   * @memberof module:Parallazy
   * Also removes all event Listeners.
   * Removes all event listeners and element class names.
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
   * @private
   * @param {HTMLElement} el
   */
  onInit(el) {
    // Create namespaced eventnames
    const progress = parallize(el, {
      offset: this.options.offset,
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
   * @param {HTMLElement} el
   * @returns {promise}
   */
  checkForItems(el) {
    return new Promise((resolve, reject) => {
      const progress = parallize(el, {
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
