const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const LRU = require('lru-cache')
const crypto = require('crypto')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser())
app.use(cookieParser())

const notes = [
  {
    content: 'HTML on helppoa',
    date: '2017-12-10T17:30:31.098Z'
  },
  {
    content: 'Selain pystyy suorittamaan vain javascriptiä',
    date: '2017-12-10T18:39:34.091Z'
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    date: '2017-12-10T19:20:14.298Z'
  },
]

const userNotesStorage = new LRU({
  max: 50 * 1024 * 1024, // 50 mb content & dates
  length: (notes) => notes.reduce((acc, x) => acc + x.content.length + 8, 0),
  updateAgeOnGet: true
})

app.use((req, res, next) => {
  let userid = req.cookies.userid
  if (!userid) {
    userid = crypto.randomBytes(32).toString('hex')
    res.cookie('userid', userid)
  }
  req.userNotes = userNotesStorage.get(userid) || []
  const origLen = req.userNotes.length

  next()

  if (origLen !== req.userNotes.length) {
    userNotesStorage.set(userid, req.userNotes)
  }
})

const notes_page = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="/main.css" />
  <script type="text/javascript" src="main.js"></script>
</head>
<body>
  <div class='container'>
    <h1>Muistiinpanot</h1>
    <div id='notes'>
    </div>
    <form action='/new_note' method='POST'>
      <input type="text" name="note"><br>
      <input type="submit" value="Talleta">
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
    <h1>Muistiinpanot -- single page app</h1>
    <div id='notes'>
    </div>
    <form id='notes_form'>
      <input type="text" name="note"><br>
      <input type="submit" value="Talleta">
    </form>
  </div>
</body>
</html>
`

const getFrontPageHtml = (noteCount) => {
  return(`
<!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class='container'>
          <h1>Full stack -esimerkkisovellus</h1>
          <p>muistiinpanoja luotu ${noteCount} kappaletta</p>
          <a href='/notes'>muistiinpanot</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>
`)
} 

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length + req.userNotes.length)
  res.send(page)
})

app.get('/notes', (req, res) => {
  res.send(notes_page)
})

app.get('/spa', (req, res) => {
  res.send(notes_spa)
})

app.get('/data.json', (req, res) => {
  res.json(notes.concat(req.userNotes))
})

app.post('/new_note_spa', (req, res) => {
  req.userNotes.push(req.body)
  res.status(201).send({ message: 'note created'})
})

app.post('/new_note', (req, res) => {
  req.userNotes.push( {
    content: req.body.note,
    date: new Date()
  })
  
  res.redirect('/notes')
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))