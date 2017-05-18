# parallazy

> A lazy parallax plugin

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/pixelass/parallazy/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/pixelass/parallazy.svg?style=flat-square)](https://github.com/pixelass/parallazy/issues)
[![Coveralls](https://img.shields.io/coveralls/pixelass/parallazy.svg?style=flat-square)](https://coveralls.io/github/pixelass/npm-boilerplate)
[![bitHound](https://img.shields.io/bithound/code/github/pixelass/parallazy.svg?style=flat-square)](https://www.bithound.io/github/pixelass/parallazy)
[![bitHound](https://img.shields.io/bithound/devDependencies/github/pixelass/parallazy.svg?style=flat-square)](https://www.bithound.io/github/pixelass/parallazy)
[![Inline docs](http://inch-ci.org/github/pixelass/parallazy.svg?branch=master)](http://inch-ci.org/github/pixelass/parallazy)

[![Browserify](https://img.shields.io/badge/build-browserify-3c6991.svg?style=flat-square)](http://browserify.org/)
[![Babel](https://img.shields.io/badge/babel-stage--2-f5da55.svg?style=flat-square)](http://babeljs.io/docs/plugins/preset-stage-2/)
[![Babel](https://img.shields.io/badge/babel-transform--runtime-f5da55.svg?style=flat-square)](http://babeljs.io/docs/plugins/transform-runtime/)
[![code style xo](https://img.shields.io/badge/code_style-XO-64d8c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-44aa44.svg?style=flat-square)](https://github.com/conventional-changelog/standard-version)
[![test ava](https://img.shields.io/badge/test-🚀_AVA-0e1d5c.svg?style=flat-square)](https://github.com/avajs/ava)

[![yarn](https://img.shields.io/badge/yarn-friendly-2c8ebb.svg?style=flat-square)](https://yarnpkg.com/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-44aa44.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![CSS modules](https://img.shields.io/badge/css-modules-44aa44.svg?style=flat-square)](https://github.com/css-modules/css-modulesify)
[![CSS next](https://img.shields.io/badge/css-next-44aa44.svg?style=flat-square)](http://cssnext.io/)

<!-- toc -->

- [Usage](#usage)
  * [Multiple instances](#multiple-instances)
  * [Custom options](#custom-options)
  * [Destroy](#destroy)
- [Developing](#developing)

<!-- tocstop -->

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

### Custom options

```js
import Parallazy from 'parallazy'

const elements = Array.from(document.querySelectorAll('.parallazy'))

const parallazies = elements.map(el => {
  // configure instance
  const parallazy = new Parallazy({
    classNames: {
      visibleX: styles.visibleX,
      visibleY: styles.visibleY,
      initiallyVisible: styles.initiallyVisible,
      pluginLoaded: styles.pluginLoaded
    },
    decimals: 2,
    entering: false,
    onProgress(el, p) {
      el.style.setProperty('--progress-y', p.progressY)
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
