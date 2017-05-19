import {writeFileSync} from 'fs'
import path from 'path'
import pug from 'pug'

const src = path.join(__dirname, '../views')
const target = path.join(__dirname, '../docs')
// add or remove files from this list
// key: input file
// value: output file
const fileMap = {
  'index.pug': 'index.html'
}
const inputFiles = Object.keys(fileMap)
const renderPug = () => {
  inputFiles.forEach(file => {
    const inFile = path.join(src, file)
    const outFile = path.join(target, fileMap[file])
    const html = pug.renderFile(inFile)
    writeFileSync(outFile, html)
  })
}

export default renderPug
