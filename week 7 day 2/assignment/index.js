const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('user is connected')
    //chatUsers += 1
    socket.on('Houston', (chat) => {
        console.log(chat)
        chatMessages.push(chat)
        // server sends message to the client
        io.emit('Houston', chat)
    })
    io.emit('connection', chatUsers)
})

app.use(express.static('client'))

const mustacheExpress = require('mustache-express')
const session = require('express-session')
const tripsRouter = require('./routes/trips')
const usersRouter = require('./routes/users')
app.use(express.urlencoded())

app.use(session({
    secret: 'tacocat',
    saveUninitialized: true,
    resave: true
}))

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use('/trips', tripsRouter)
app.use('/users', usersRouter)
app.use(express.static('static'))

global.trips = [{ title: "Honeymoon", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/10/74/8b/bungalows-facing-mont.jpg?w=900&h=600&s=1", city: "Tahiti", departureDate: "2022-05-06", returnDate: "2022-05-18", tripId: 1, username: "Phil" }, { title: "Australia", image: "https://gifts.worldwildlife.org/gift-center/Images/large-species-photo/large-Koala-photo.jpg", city: "Sydney", departureDate: "2022-02-01", returnDate: "2022-02-22", tripId: 2, username: "Allison" }]

global.users = [{ username: "Phil", password: "123", userId: 1 }, { username: "Allison", password: "123", userId: 2 }]

global.chatMessages = [{ username: "SmarterChild", message: "Welcome to the chat room!" }]

global.chatUsers = []

http.listen(3000, () => {
    console.log('Server is running...')
})