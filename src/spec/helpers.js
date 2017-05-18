import test from 'ava'
import {inBound, minMax} from '../helpers'

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
