# Parallazy

Parallazy is a parallax plugin that doesn't do much on its own.

Per default it adds classNames to elements when they enter the viewport. 
With the help of callbacks however, you can implement a huge variety of effects.

You can track the element when it's visible or as it enters the viewport and even create your own bounding box. 
While visible a callback delivers progress values, exposing how far the element is from either side of the bounding box.

Additionally you can define callbacks when the element is out of bound on either side.


[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/pixelass/parallazy/master/LICENSE)
[![npm](https://img.shields.io/npm/v/parallazy.svg?style=flat-square)](https://www.npmjs.com/package/parallazy)

[![Travis branch](https://img.shields.io/travis/pixelass/parallazy/master.svg?style=flat-square)](https://travis-ci.org/pixelass/parallazy)
[![Coveralls](https://img.shields.io/coveralls/pixelass/parallazy.svg?style=flat-square)](https://coveralls.io/github/pixelass/parallazy)
[![Inline docs](http://inch-ci.org/github/pixelass/parallazy.svg?branch=master&style=flat-square)](http://inch-ci.org/github/pixelass/parallazy)
[![bitHound](https://img.shields.io/bithound/code/github/pixelass/parallazy.svg?style=flat-square)](https://www.bithound.io/github/pixelass/parallazy)
[![bitHound](https://img.shields.io/bithound/dependencies/github/pixelass/parallazy.svg?style=flat-square)](https://www.bithound.io/github/pixelass/parallazy)
[![bitHound](https://img.shields.io/bithound/devDependencies/github/pixelass/parallazy.svg?style=flat-square)](https://www.bithound.io/github/pixelass/parallazy)  
[![GitHub issues](https://img.shields.io/github/issues/pixelass/parallazy.svg?style=flat-square)](https://github.com/pixelass/parallazy/issues)
[![GitHub pulls](https://img.shields.io/github/issues-pr/pixelass/parallazy.svg?style=flat-square)](https://github.com/pixelass/parallazy/pulls)

[![code style xo](https://img.shields.io/badge/code_style-XO-64d8c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)
[![test ava](https://img.shields.io/badge/test-🚀_AVA-0e1d5c.svg?style=flat-square)](https://github.com/avajs/ava)
[![yarn](https://img.shields.io/badge/yarn-friendly-2c8ebb.svg?style=flat-square)](https://yarnpkg.com/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-44aa44.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-44aa44.svg?style=flat-square)](https://github.com/conventional-changelog/standard-version)  
[![Browserify](https://img.shields.io/badge/build-browserify-3c6991.svg?style=flat-square)](http://browserify.org/)
[![Babel](https://img.shields.io/badge/babel-stage--2-f5da55.svg?style=flat-square)](http://babeljs.io/docs/plugins/preset-stage-2/)
[![Babel](https://img.shields.io/badge/babel-transform--runtime-f5da55.svg?style=flat-square)](http://babeljs.io/docs/plugins/transform-runtime/)

<!-- toc -->

- [Links](#links)
- [Usage](#usage)
  * [Multiple instances](#multiple-instances)
  * [Options](#options)
    + [Classnames](#classnames)
    + [Entering](#entering)
    + [Offset](#offset)
    + [Decimals](#decimals)
    + [Events](#events)
    + [Callbacks](#callbacks)
    + [Full example](#full-example)
  * [Destroy](#destroy)
- [Developing](#developing)

<!-- tocstop -->

## Links
  * [Old demo](https://pixelass.github.io/parallazy/)
  * [Examples 1](https://pixelass.github.io/parallazy/examples-1.html)

## Usage

```
yarn add parallazy
```

### Multiple instances

```js
import Parallazy from 'parallazy'

const elements = Array.from(document.querySelectorAll('.parallazy'))

const parallazies = elements.map(el => {
  const parallazy = new Parallazy()
  parallazy.init(el)
  return parallazy
})
```

### Options

* `{object}` **`classNames`**
  * `{string}` **`classNames.visibleX`**
  * `{string}` **`classNames.visibleY`**
  * `{string}` **`classNames.pluginLoaded`**
* `{boolean}` **`entering`**
* `{object}` **`offset`**
  * `{number|function}` **`offset.top`**
  * `{number|function}` **`offset.right`**
  * `{number|function}` **`offset.bottom`**
  * `{number|function}` **`offset.left`**
* `{number}` **`decimals`**
* `{array.<string>}` **`events`**
* `{function|null}` **`onProgress`**
* `{function|null}` **`onTop`**
* `{function|null}` **`onRight`**
* `{function|null}` **`onBottom`**
* `{function|null}` **`onLeft`**

#### Classnames

Use an object of classNames to add custom classes when the plugin is loaded and when the element is visible.

#### Entering

An element can be tracked while it's entering and leaving the bounding box.  
Optionally you can decide to prevent tracking until the element is fully visible.  
Both options respect the offset option.

#### Offset

Offset allows you to create a ghost bounding box.  
You can either pass a number or a function while each property defaults to `0`.  

```js
const offset = {
  top() {
    window.innerHeight / 2 // will always subtract half of the window height, even after resize
  },
  right() {
    element.offsetWidth / 2 // will always subtract half of the element width, even after size change
  },
  left: 100 // will always subtract 100,
  // bottom is not set so `0` will be used
}
```

#### Decimals

Defines how many decimals you want to return.

```js
const options = {
  decimals: 4,
  onProgress({top}) {
    console.log(top) // 0.0000, 0.0003
  }
}
```

#### Events

Per default `scroll` and `resize` are tracked. You can add or remove events here.

#### Callbacks

The plugin calls multiple calbacks when defined.  
The main callback is `onProgress` which is called with an object.
It is only called if the element is considered in bound.  
The other callbacks are once. They are reset when `onProgress` is called (the element is in bound).

```js
const options = {
  onProgress(p) {
    console.log(p) // => {top: 0, right: 0.7, bottom: 1, left: 0.3}
  },
  onTop() {
    console.log('Out of bounds top') // only called once until reset
  }
}
```

#### Full example

```js
import Parallazy from 'parallazy'

const elements = Array.from(document.querySelectorAll('.parallazy'))

const parallazies = elements.map(el => {
  // configure instance
  const parallazy = new Parallazy({
    classNames: {
      visibleX: styles.visibleX,
      visibleY: styles.visibleY,
      pluginLoaded: styles.pluginLoaded
    },
    offset: {
      bottom: 100,
      top: -100
    },
    decimals: 2,
    entering: false,
    events: ['scroll'],
    onProgress({top}) {
      el.style.setProperty('--progress-y', top)
    },
    onTop() {
      el.style.setProperty('--progress-y', 1)
    },
    onBottom() {
      el.style.setProperty('--progress-y', 0)
    }
  })
  // initialize instance
  parallazy.init(el)
  return parallazy
})
```

### Destroy

```js
import Parallazy from 'parallazy'

const parallazy = new Parallazy()
// Initialize instance.
parallazy.init(document.querySelector('.parallazy'))
// Destroy instance.
parallazy.destroy()
```

## Developing

To start a dev server and start developing try the following commands

* `start`: starts the dev server and builds the required files
* `test`: runs test and lints files
* `dev`: starts the dev server and watches the required files
* `babel`: generates lib from source
* `build`: builds all files from source
* `watch`: builds and watches all files from source
* `lint`: lints JavaScript files
* `release`: release new version using "standard-version"

© 2017 by [Gregor Adams](http://pixelass.com)
