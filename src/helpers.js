const minMax = (n, max = 1, min = 0) => Math.max(min, Math.min(max, n))
const inBound = (n, max = 1, min = 0) => n > min && n < max

export {
  minMax,
  inBound
}
