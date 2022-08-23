require('dotenv').config();
require('./mongo')
const express = require('express');
const cors = require('cors');
const app = express();
const Url = require('./models/Url')


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json())

// Routes
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Url shortener
app.post('/api/shorturl', async (req, res) => {
  const { url: reqUrl } = req.body

  const regex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gi

  if (!regex.test(reqUrl)) {
    return res.json({ error: 'invalid url' })
  }

  const findUrl = await Url.findOne({ original_url: reqUrl.toLowerCase() })
  
  if (findUrl) {
    return res.json(findUrl)
  } 
  
  const urlsCount = await Url.countDocuments({})
  const newUrl = new Url({ original_url: reqUrl, short_url: urlsCount + 1 })
  const savedUrl = await newUrl.save()

  res.json(savedUrl)
})

// Redirect
app.get('/api/shorturl/:short', async (req, res) => {
  const { short } = req.params
  const findUrl = await Url.findOne({ short_url: short })

  if (!findUrl) {
    return res.json({ error: 'invalid short url' })
  }

  res.redirect(findUrl.original_url)
})

// connection
app.listen(port, function() {
  console.log(`Listening on port ${port}`)
});
