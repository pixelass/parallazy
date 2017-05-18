import {exec} from 'child_process'
import log from 'winston'
import pkg from '../package.json'


const serve = () => {
  log.info(`starting server on http://localhost:${pkg.config.devPort}`)
  exec(`cd docs && http-server -p ${pkg.config.devPort}`, err => {
    if (err) {
      throw err
    }
  })
}

export default serve
