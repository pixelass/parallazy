/**
 * @private
 * @author Gregor Adams <greg@pixelass.com>
 */

import test from 'ava'
import {inBound, minMax, isCallback} from '../helpers'

test('isCallback is a function', t => {
  t.true(typeof isCallback === 'function')
})

test('1 is not a callback', t => {
  t.false(isCallback(1))
})

test('"foo" is not a callback', t => {
  t.false(isCallback('foo'))
})

test('true is not a callback', t => {
  t.false(isCallback(true))
})

test('{} is not a callback', t => {
  t.false(isCallback({}))
})

test('[] is not a callback', t => {
  t.false(isCallback([]))
})

test('()=>{} is not callback', t => {
  t.true(isCallback(() => {}))
})

test('inBound is a function', t => {
  t.true(typeof inBound === 'function')
})

test('inBound returns a boolean', t => {
  t.true(typeof inBound(0) === 'boolean')
})

test('inBound(0|1) is false', t => {
  t.true(inBound(0) === false)
  t.true(inBound(1) === false)
})

test('inBound(0.999) is true', t => {
  t.true(inBound(0.999) === true)
})

test('inBound has optional parameters', t => {
  t.true(inBound(1, 2) === true)
  t.true(inBound(0, 2, 1) === false)
})

test('minMax is a function', t => {
  t.true(typeof minMax === 'function')
})

test('minMax returns a number', t => {
  t.true(typeof minMax(0) === 'number')
})

test('minMax(n) is min0', t => {
  t.true(minMax(-1) === 0)
  t.true(minMax(-2) === 0)
  t.true(minMax(-3) === 0)
})

test('minMax(n) is max 1', t => {
  t.true(minMax(2) === 1)
  t.true(minMax(3) === 1)
  t.true(minMax(4) === 1)
})

test('minMax has optional parameters', t => {
  t.true(minMax(5, 2) === 2)
  t.true(minMax(6, 2, 1) === 2)
  t.true(minMax(-6, 2, 1) === 1)
})
