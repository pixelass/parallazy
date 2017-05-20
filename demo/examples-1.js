/* global document */
import Parallazy from '../src'
import styles from './examples-1.css' // eslint-disable-line import/no-unassigned-import

const $ = (selector, context = document) => Array.from(context.querySelectorAll(selector))

$('.parallazy').forEach((el, i) => {
  const $inner = $('.inner', el)
  const parallazy = new Parallazy({
    classNames: {
      visibleX: styles.visibleX,
      visibleY: styles.visibleY,
      initiallyVisible: styles.initiallyVisible,
      pluginLoaded: styles.pluginLoaded
    },
    entering: false,
    offset: {
      top: 2000,
      bottom: 200,
      left: 0,
      right: 0
    },
    decimals: 6,
    onProgress(el, p) {
      const offset = (Math.pow(p.progressY, (i % 4) + 1) * 100).toFixed(4)
      $inner[0].style.transform = `translate3d(${offset}%,0,0)`
    }
  })
  parallazy.init(el)
})
