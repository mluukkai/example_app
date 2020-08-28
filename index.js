const express = require('express')
const path = require('path')
const boyParser = require('body-parser')

const PORT = process.env.PORT || 5000
const MAX_NOTES = 100;
const PATH_PREFIX = '/exampleapp';

const app = express()

app.use(boyParser())

const notes = [
  {
    content: 'HTML is easy',
    date: new Date('2019-05-23T17:30:31.098Z'),
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date('2019-05-23T18:39:34.091Z'),
  },
  {
    content: 'Most important methods of HTTP-protocol are GET and POST',
    date: new Date('2019-05-23T19:20:14.298Z'),
  },
]

const isValidNote = note => {
  return typeof note === 'object' && typeof note.content === 'string' && !isNaN(new Date(note.date).getTime())
}

const createNote = note => {
  notes.push(note);

  if (notes.length > MAX_NOTES) {
    notes.shift()
  }
}

const formatNote = note => {
  return {
    content: note.content.substring(0, 200),
    date: new Date(note.date),
  }
}

const notes_page = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="${PATH_PREFIX}/main.css" />
  <script type="text/javascript" src="${PATH_PREFIX}/main.js"></script>
</head>
<body>
  <div class='container'>
    <h1>Notes</h1>
    <div id='notes'>
    </div>
    <form action='${PATH_PREFIX}/new_note' method='POST'>
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
  <link rel="stylesheet" type="text/css" href="${PATH_PREFIX}/main.css" />
  <script type="text/javascript" src="${PATH_PREFIX}/spa.js"></script>
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
          <h1>Full stack example app</h1>
          <p>number of notes created ${noteCount}</p>
          <a href='${PATH_PREFIX}/notes'>notes</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>
`)
} 

const router = express.Router();

router.use(express.static(path.join(__dirname, 'public')))

router.get('/', (req, res) => {
  const page = getFronPageHtml(notes.length)
  res.send(page)
})

router.get('/reset', (req, res) => {
  notes.splice(0, notes.length)
  res.status(201).send({ message: 'notes reset' })
})

router.get('/notes', (req, res) => {
  res.send(notes_page)
})

router.get('/spa', (req, res) => {
  res.send(notes_spa)
})

router.get('/data.json', (req, res) => {
  res.json(notes)
})

router.post('/new_note_spa', (req, res) => {
  if (!isValidNote(req.body)) {
    return res.send('invalid note').status(400)
  }

  createNote(formatNote(req.body))

  res.status(201).send({ message: 'note created' })
})

router.post('/new_note', (req, res) => {
  if (typeof req.body.note === 'string') {
    createNote(formatNote({
      content: req.body.note,
      date: new Date()
    }))
  }
  
  res.redirect(`${PATH_PREFIX}/notes`)
})

if (process.env.NODE_ENV === 'development') {
  app.use(PATH_PREFIX, router)
} else {
  app.use('/', router)
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`))