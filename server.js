import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import Score from './scoreModel.js'

// ************* Database ***************

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// catch 400
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(400).send(`Error: ${res.originUrl} not found`)
  next()
})

// catch 500
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send(`Error: ${err}`)
  next()
})

// CORS
const corsOptions = {
  origin: ['http://localhost:4200', 'http://davidxps15:4200', 'http://localhost', 'http://davidxps15'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.get('/scores', (req, res) => {
  Score.find({},
    'username score')
    .skip(parseInt(req.query.pageLimit) * (req.query.pageNum - 1))
    .limit(parseInt(req.query.pageLimit))
    .sort({score: -1})
    .exec(function (err, regions) {
      if (err) {
        res.send(err)
      }

      res.json([regions])
    })
});

app.post('/scores', (req, res) => {
  const newScore = new Score(req.body)

  newScore.save((err, score) => {
    if (err) {
      res.send(err)
    }

    res.json(score)
  })
});


//  ************ Spin up ********************
const port = process.env.PORT || '3000'
app.listen(port)

console.log(`Listening on port ${port}`)
