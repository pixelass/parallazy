import express from 'express'
import pkg from '../package.json' // eslint-disable-line import/extensions

const serve = () => {
  const PORT = process.env.PORT || pkg.config.devPort
  const app = express()
  app.use(express.static('docs'))
  app.set('view engine', 'pug')
  app.get('/', (req, res) => {
    res.render('index')
  })
  app.get('/examples-:page.html', ({params}, res) => {
    res.render(`examples-${params.page}`)
  })
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
  })
}

export default serve
