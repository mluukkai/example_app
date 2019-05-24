const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser())

const notes = [
  {
    content: 'HTML is easy',
    date: '2019-05-23T17:30:31.098Z'
  },
  {
    content: 'Browser can execute only Javascript',
    date: '2019-05-23T18:39:34.091Z'
  },
  {
    content: 'Most important methods of HTTP-protocol are GET and POST',
    date: '2019-05-23T19:20:14.298Z'
  },

]

const notes_page = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="/main.css" />
  <script type="text/javascript" src="main.js"></script>
</head>
<body>
  <div class='container'>
    <h1>Notes</h1>
    <div id='notes'>
    </div>
    <form action='/new_note' method='POST'>
      <input type="text" name="note"><br>
      <input type="submit" value="Save">
    </form>
  </div>
</body>
</html>
`

const notes_spa = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="/main.css" />
  <script type="text/javascript" src="spa.js"></script>
</head>
<body>
  <div class='container'>
    <h1>Notes -- single page app</h1>
    <div id='notes'>
    </div>
    <form id='notes_form'>
      <input type="text" name="note"><br>
      <input type="submit" value="Save">
    </form>
  </div>
</body>
</html>
`

const getFronPageHtml = (noteCount) => {
  return(`
<!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class='container'>
          <h1>Full stack exampe app</h1>
          <p>number of notes created ${noteCount}</p>
          <a href='/notes'>notes</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>
`)
} 

app.get('/', (req, res) => {
  const page = getFronPageHtml(notes.length)
  res.send(page)
})

app.get('/reset', (req, res) => {
  notes.splice(0, notes.length)
  res.status(201).send({ message: 'notes reset' })
})

app.get('/notes', (req, res) => {
  res.send(notes_page)
})

app.get('/spa', (req, res) => {
  res.send(notes_spa)
})

app.get('/data.json', (req, res) => {
  res.json(notes)
})

app.post('/new_note_spa', (req, res) => {
  notes.push(req.body)
  res.status(201).send({ message: 'note created'})
})

app.post('/new_note', (req, res) => {
  notes.push( { 
    content: req.body.note,
    date: new Date()
  })
  
  res.redirect('/notes')
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))