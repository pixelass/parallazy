/* global document */
import {
  easeInCubic,
  easeInOutSine,
  easeOutSine,
  easeInSine
} from 'easing-utils'

import Parallazy from '../src'
import styles from './main.css' // eslint-disable-line import/no-unassigned-import

const items = Array.from(document.querySelectorAll('.parallazy'))

const eases = [
  easeInCubic,
  easeInOutSine,
  easeOutSine,
  easeInSine
]

items.forEach((el, i) => {
  const parralazy = new Parallazy({
    classNames: {
      visibleX: styles.visibleX,
      visibleY: styles.visibleY,
      initiallyVisible: styles.initiallyVisible,
      pluginLoaded: styles.pluginLoaded
    },
    decimals: 2,
    entering: false,
    onProgress(el, p) {
      el.style.setProperty('--progress-y', eases[i % eases.length](p.progressY))
    }
  })
  parralazy.init(el)
})
