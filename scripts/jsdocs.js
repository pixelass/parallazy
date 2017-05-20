import path from 'path'
import rm from 'rm-r'
import mkdirp from 'mkdirp'
import config from '../jsdoc.json'

const docsFolder = path.join(__dirname, '../', config.opts.destination)
rm(docsFolder, err => {
  if (err) {
    throw err
  }
  mkdirp(docsFolder)
})