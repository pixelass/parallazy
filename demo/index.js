/* global document */
import {
  easeInCubic,
  easeInOutSine,
  easeOutSine,
  easeOutQuad,
  easeInOutElastic,
  easeInSine
} from 'easing-utils'

import Parallazy from '../src'
import styles from './main.css' // eslint-disable-line import/no-unassigned-import

const examples = [
  {
    selector: '.example_1',
    eases: [
      easeInCubic,
      easeOutQuad,
      easeInOutElastic,
      easeOutSine,
      easeInSine
    ],
    options: {
      decimals: 4,
      entering: true,
      offsetX: 0,
      offsetY: 0
    }
  },
  {
    selector: '.example_2',
    options: {
      decimals: 6,
      entering: true,
      offsetX: 100,
      offsetY: 100
    }
  },
  {
    selector: '.example_3',
    options: {
      decimals: 4,
      entering: false,
      offsetX: 0,
      offsetY: 0
    }
  },
  {
    selector: '.example_4',
    eases: [
      easeInCubic,
      easeInOutSine,
      easeOutSine,
      easeInOutElastic
    ],
    options: {
      decimals: 6,
      entering: false,
      offsetX: 100,
      offsetY: 100
    }
  }
]

examples.forEach(({selector, options, eases}) => {
  Array.from(document.querySelectorAll(selector)).forEach((el, i) => {
    const easing = eases ? eases[i % eases.length] : t => t
    const pX = el.querySelector('.perc-x')
    const pY = el.querySelector('.perc-y')
    const ea = el.querySelector('.easing')
    const bar = el.querySelector('.bar')
    if (eases) {
      ea.innerText = `${eases[i % eases.length]}`.split(/\s+/)[1].replace('(t)', '')
    } else {
      ea.innerText = 'linear'
    }
    const parallazy = new Parallazy({
      classNames: {
        visibleX: styles.visibleX,
        visibleY: styles.visibleY,
        initiallyVisible: styles.initiallyVisible,
        pluginLoaded: styles.pluginLoaded
      },
      onProgress(el, p) {
        pX.innerText = `${(easing(p.progressX) * 100).toFixed(options.decimals - 2)}%`
        pY.innerText = `${(easing(p.progressY) * 100).toFixed(options.decimals - 2)}%`
        bar.style.transform = `scale3d(1, ${easing(p.progressY)}, 1)`
      },
      ...options
    })
    parallazy.init(el)
  })
})
