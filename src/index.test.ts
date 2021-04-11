import proxyquire from 'proxyquire'
import { test } from 'uvu'
import assert from 'uvu/assert'

const {
  Exome,
  updateMap,
  updateView,
  saveState,
  loadState,
  getExomeId,
  addMiddleware
} = proxyquire('./index.ts', {
  './react.ts': {
    useStore: true,
    '@noCallThru': true
  }
})

test('exports `Exome`', () => {
  assert.ok(Exome)
})

test('exports `updateMap`', () => {
  assert.ok(updateMap)
  assert.instance(updateMap, Map)
})

test('exports `updateView`', () => {
  assert.ok(updateView)
  assert.instance(updateView, Function)
})

test('exports `saveState`', () => {
  assert.ok(saveState)
  assert.instance(saveState, Function)
})

test('exports `loadState`', () => {
  assert.ok(loadState)
  assert.instance(loadState, Function)
})

test('exports `getExomeId`', () => {
  assert.ok(getExomeId)
  assert.instance(getExomeId, Function)
})

test('exports `addMiddleware`', () => {
  assert.ok(addMiddleware)
  assert.instance(addMiddleware, Function)
})

test.run()
