import {createWriteStream} from 'fs'
import path from 'path'
import log from 'winston'
import browserify from 'browserify'
import watchify from 'watchify'
import errorify from 'errorify'
import cssModulesify from 'css-modulesify'
import cssNext from 'postcss-cssnext'
import hmr from 'browserify-hmr'
import rm from 'rm-r'
import copy from 'copy'
import globby from 'globby'
import {config} from '../package.json' // eslint-disable-line import/extensions
import shortid from './shortid'
import renderPug from './render-pug'

const demoFolder = path.join(__dirname, '../demo')
const buildFolder = path.join(__dirname, '../docs')

// Add or remove files from this list
// key: input file
// value: output name (used for css and js)
const fileMap = {
  'index.js': 'main',
  'examples-1.js': 'examples-1'
}
// These files will be copied from the demoFolder to the buildFolder
const demoFiles = [
  'favico.png'
]
const inputFiles = Object.keys(fileMap)

const build = (watch = false) => {
  const prod = process.env.NODE_ENV === 'production'
  globby(path.join(buildFolder, '*.{js,css,png,html}'))
    .then(files =>
      Promise.all(files.map(file => {
        rm.file(file)
        return Promise.resolve()
      }))
    )
  .catch(err => {
    throw err
  })
  .then(() => {
    if (watch) {
      log.info('serving views')
    } else {
      log.info('writing HTML files')
      renderPug()
    }
    demoFiles.forEach(file =>
      copy(`${path.join(demoFolder, file)}`, buildFolder, {flatten: true}, err => {
        if (err) {
          throw err
        }
      }))

    // Create a bundler for each file
    inputFiles.forEach((file, index) => {
      const inFile = path.join(demoFolder, file)
      const outFile = path.join(buildFolder, fileMap[file])

      const b = browserify({
        entries: [inFile],
        plugin: [errorify],
        debug: watch
      })

      const bundle = () => {
        b.bundle().pipe(createWriteStream(`${outFile}.js`))
      }

      // Either uglify or watch
      if (watch) {
        b.on('update', bundle)
        b.plugin(watchify)
        const port = config.devPort + 2 + index
        const url = `http://localhost:${port}`
        b.plugin(hmr, {url, port})
      } else {
        b.transform({
          global: true,
          ignore: ['**/*.css']
        }, 'uglifyify')
      }

      b.on('log', message => log.info(message))
      b.on('error', message => log.error(message))
      b.plugin(cssModulesify, {
        after: [cssNext()],
        output: `${outFile}.css`,
        jsonOutput: `${outFile}.json`,
        generateScopedName: prod ? shortid : cssModulesify.generateScopedName,
        global: true
      })

      bundle()
    })
  })
}

export default build
