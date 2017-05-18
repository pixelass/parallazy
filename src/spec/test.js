import test from 'ava'
import {inBound} from '../helpers'

test('inBound is a function', t => {
  t.true(typeof inBound === 'function')
})
