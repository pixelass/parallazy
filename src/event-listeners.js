/**
 * Global event listeners via [one-listener](https://github.com/pixelass/one-listener).
 * @private
 * @file src/event-listeners.js
 * @author Gregor Adams <greg@pixelass.com>
 */

import OneListener from 'one-listener'

const one = new OneListener({limit: 100, throttle: 50})
const {requestEventListener, cancelEventListener} = one

export {requestEventListener, cancelEventListener}
export default one
