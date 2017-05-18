/* global window */
import {minMax} from './helpers'

const parralize = (element, options = {}) => {
  const settings = {
    entering: true,
    offsetX: 0,
    offsetY: 0,
    decimals: 2,
    ...options
  }
  const {
    top,
    left,
    height,
    width
  } = element.getBoundingClientRect()
  const {
    innerHeight,
    innerWidth
  } = window
  const {
    entering,
    offsetX,
    offsetY,
    decimals
  } = settings
  let x = 0
  let y = 0
  const lO = left - offsetX
  const tO = top - offsetY
  const wO = innerWidth - (offsetX * 2)
  const hO = innerHeight - (offsetY * 2)

  if (entering) {
    x = (lO + width) / (wO + width)
    y = (tO + height) / (hO + height)
  } else {
    x = lO / (wO - width)
    y = tO / (hO - height)
  }
  const progressY = (1 - minMax(y)).toFixed(decimals)
  const progressX = (1 - minMax(x)).toFixed(decimals)
  return {
    progressY,
    progressX
  }
}

export default parralize
