const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser())

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

const index = `
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <div class='container'>
    <h1>Full stack -esimerkkisovellus</h1>
    <a href='/notes'>muistiinpanot</a>
    <img src='kuva.png' width='200'/>
  </div>
</body>
</html>
`

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
    <form action='/notes' method='POST'>
      <input type="text" name="note"><br>
      <input type="submit" value="Talleta">
    </form>
  </div>
</body>
</html>
`

app.get('/', (req, res) => {
  res.send(index)
})

app.get('/notes', (req, res) => {
  res.send(notes_page)
})

app.get('/data.json', (req, res) => {
  res.json(notes)
})

app.post('/notes', (req, res) => {
  notes.push( { 
    content: req.body.note,
    date: new Date()
  })
  return res.redirect('/notes')
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))