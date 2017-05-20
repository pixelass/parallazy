import express from 'express'
import path from 'path'
import pkg from '../package.json'

const serve = () => {
  const PORT = process.env.PORT || pkg.config.devPort
  const app = express()
  app.use(express.static('docs'))
  app.set('view engine', 'pug')
  app.get('/', function (req, res) {
    res.render('index')
  })
  app.get('/examples-:page.html', function ({params}, res) {
    res.render(`examples-${params.page}`)
  })
  app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`)
  })
}

export default serve
