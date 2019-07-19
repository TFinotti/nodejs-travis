import express = require('express')
var bodyparser = require('body-parser')
var cookieParser = require('cookie-parser')

const app = express()

import path = require('path')
app.use(express.static(path.join(__dirname, '/../public')))

app.use(cookieParser())

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

app.get('/hello/:name', (req: any, res: any) => {
  if (req.params.name === "Tiago") {
    res.render('tiago.ejs');
  } else {
    res.render('hello.ejs', { name: req.params.name });
  }
})

// app.get('/metrics.json', (req: any, res: any) => {
//   MetricsHandler.get((err: Error | null, result?: any) => {
//     if (err) {
//       throw err
//     }
//     res.json(result)
//   })
// })

// Initialize connection once
import { MetricsHandler, Metric } from './metrics'
var db: any
var dbUser: any
import { UserHandler, User } from './user'
var mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient // Create a new MongoClient
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
  if (err) throw err
  db = client.db('mydb')
  dbUser = new UserHandler(db)

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

import session = require('express-session')
import ConnectMongo = require('connect-mongo')
const MongoStore = ConnectMongo(session)

app.use(session({
  secret: 'user session',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: 'mongodb://localhost/mydb' })
}))

const authRouter = express.Router()

authRouter.get('/login', function (req: any, res: any) {
  
  console.log(req)
  res.render('login')
})

authRouter.get('/signup', function (req: any, res: any) {
  res.render('signup')
})


authRouter.get('/logout', function (req: any, res: any) {
  if (req.session.loggedIn) {
    delete req.session.loggedIn
    delete req.session.user
  }
  res.redirect('/login')
})

authRouter.post('/login', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
    if (err) next(err)
    if (result === null || !result.validatePassword(req.body.password)) {
      console.log('login')
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

app.use(authRouter)

const userRouter = express.Router()

userRouter.post('/signup', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
    if (err) next(err)
    if (result) {
      res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("user persisted")
      })
    }
  })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result: User | null) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})

app.use(userRouter)

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('main.ejs');
})