/* global document window */
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
      offset: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    }
  },
  {
    selector: '.example_2',
    options: {
      decimals: 6,
      entering: true,
      offset: {
        top() {
          return window.innerHeight / 2
        },
        bottom: 100,
        left: 100,
        right: 100
      }
    }
  },
  {
    selector: '.example_3',
    options: {
      decimals: 4,
      entering: false,
      offset: {
        top: 0,
        bottom: 100,
        left: 0,
        right: 100
      }
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
      offset: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      }
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
      ea.innerText = `${eases[i % eases.length]}`.split(/\s+/)[1].split('(')[0]
    } else {
      ea.innerText = 'linear'
    }
    const parallazy = new Parallazy({
      classNames: {
        visibleX: styles.visibleX,
        visibleY: styles.visibleY,
        pluginLoaded: styles.pluginLoaded
      },
      onProgress(p) {
        pX.innerText = `${(easing(p.left) * 100).toFixed(options.decimals - 2)}% : ${(easing(p.right) * 100).toFixed(options.decimals - 2)}%`
        pY.innerText = `${(easing(p.top) * 100).toFixed(options.decimals - 2)}% : ${(easing(p.bottom) * 100).toFixed(options.decimals - 2)}%`
        bar.style.transform = `scale3d(1, ${easing(p.top)}, 1)`
      },
      onTop() {
        pY.innerText = '100% : 0%'
        bar.style.transform = 'scale3d(1,1,1)'
      },
      onBottom() {
        pY.innerText = '0% : 100%'
        bar.style.transform = 'scale3d(1,0,1)'
      },
      ...options
    })
    parallazy.init(el)
  })
})
