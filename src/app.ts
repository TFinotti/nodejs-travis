import express = require('express')
var bodyparser = require('body-parser')

const app = express()

import path = require('path')
app.use(express.static(path.join(__dirname, '/../public')))

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

app.get('/', (req: any, res: any) => {
  res.render('main.ejs');
})

app.get('/hello/:name', (req: any, res: any) => {
  if (req.params.name === "Tiago") {
    res.render('tiago.ejs');
  } else {
    res.render('hello.ejs', { name: req.params.name });
  }
})

import { MetricsHandler, Metric } from './metrics'
// app.get('/metrics.json', (req: any, res: any) => {
//   MetricsHandler.get((err: Error | null, result?: any) => {
//     if (err) {
//       throw err
//     }
//     res.json(result)
//   })
// })

// Initialize connection once
var db: any
var mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient // Create a new MongoClient
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
  if (err) throw err
  db = client.db('mydb')

  // Start the application after the database connection is ready
  const port: string = process.env.PORT || '8115'
  app.listen(port, (err: Error) => {
    if (err) {
      throw err
    }
    console.log(`server is listening on port ${port}`)
  })
});

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.post('/metrics', (req: any, res: any) => {
  if (req.body) {
    console.log(req.body)
    const metric = new Metric('Random', parseInt(req.body.value));
    new MetricsHandler(db).save(metric, (err: any, result: any) => {
      if (err)
        return res.status(500).json({ error: err, result: result });
      res.status(201).json({ error: err, result: true })
    })
  } else {
    return res.status(400).json({ error: 'Wrong request parameter', });
  }
})

app.get('/metrics', (req: any, res: any) => {
  new MetricsHandler(db).get(parseInt(req.query.value), (err: any, result: any) => {
    if (err)
      return res.status(500).json({ error: err, result: result });
    res.status(201).json({ error: err, result: result })
  })
})

app.delete('/metrics', (req: any, res: any) => {
  new MetricsHandler(db).delete(parseInt(req.query.value), (err: any, result: any) => {
    if (err)
      return res.status(500).json({ error: err, result: result });
    res.status(201).json({ error: err, result: result })
  })
})