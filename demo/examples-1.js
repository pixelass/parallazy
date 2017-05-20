/* global document */
import Parallazy from '../src'
import styles from './examples-1.css' // eslint-disable-line import/no-unassigned-import

const $ = (selector, context = document) => Array.from(context.querySelectorAll(selector))

$('.parallazy').forEach(el => {
  const $inner = $('.inner', el)
  const parallazy = new Parallazy({
    classNames: {
      visibleX: styles.visibleX,
      visibleY: styles.visibleY,
      pluginLoaded: styles.pluginLoaded
    },
    entering: false,
    offset: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 200
    },
    onProgress(p) {
      const offset = (p.top * 100).toFixed(8)
      $inner[0].style.transform = `translate3d(${offset}%,0,0)`
    },
    onTop() {
      $inner[0].style.transform = 'translate3d(100%,0,0)'
    },
    onBottom() {
      $inner[0].style.transform = 'translate3d(0%,0,0)'
    }
  })
  parallazy.init(el)
})
