import {writeFileSync} from 'fs'
import path from 'path'
import pug from 'pug'
import globby from 'globby'

const src = path.join(__dirname, '../views')
const target = path.join(__dirname, '../docs')

const renderPug = () => {
  // Render all views
  globby(path.join(src, '*.pug')).then(files => {
    files.forEach(file => {
      const {name} = path.parse(file)
      const outFile = path.join(target, `./${name}.html`)
      const html = pug.renderFile(file)
      writeFileSync(outFile, html)
    })
  })
}

export default renderPug
