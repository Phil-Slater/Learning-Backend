const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const tripsRouter = require('./routes/trips')
const usersRouter = require('./routes/users')
app.use(express.urlencoded())

app.use('/trips', tripsRouter)
app.use('/users', usersRouter)
app.use(express.static('static'))

app.use(session({
    secret: 'tacocat',
    saveUninitialized: true,
    resave: true
}))

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

global.trips = [{ title: "Honeymoon", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/10/74/8b/bungalows-facing-mont.jpg?w=900&h=600&s=1", city: "Tahiti", departureDate: "2022-05-06", returnDate: "2022-05-18", tripId: 1 }]

app.listen(3000, () => {
    console.log('Server is running...')
})