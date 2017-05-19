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
import shortid from './shortid'
import renderPug from './render-pug'
const demoFolder = path.join(__dirname, '../demo')
const buildFolder = path.join(__dirname, '../docs')

// add or remove files from this list
// key: input file
// value: output name (used for css and js)
const fileMap = {
  'index.js': 'main'
}
// these files will be copied from the demoFolder to the buildFolder
const demoFiles = [
  'favico.png'
]
const inputFiles = Object.keys(fileMap)

const outFiles = inputFiles.map(file => {
  return path.join(buildFolder, `${fileMap[file]}.js`)
})

const build = (watch = false) => {
  globby(path.join(buildFolder, '*.{js,css,png,html}'))
    .then(files =>
      Promise.all(files.map(file => {
          rm.file(file, err => Promise.resolve())
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

    // create a bundler for each file
    inputFiles.forEach(file => {
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

      // either uglify or watch
      if (watch) {
        b.on('update', bundle)
        b.plugin(watchify)
        b.plugin(hmr)
      }
      else {
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
        generateScopedName: watch ? cssModulesify.generateScopedName : shortid,
        global: true
      })

      bundle()
    })
  })
}

export default build
