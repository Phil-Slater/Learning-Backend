const express = require('express')
const app = express()


///////////////////////////////////////////////////////////////
const http = require('http').Server(app)
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('user is connected')

    socket.on('Houston', (chat) => {
        console.log(chat)
        // server sends message to the client
        io.emit('Houston', chat)
    })
})
///////////////////////////////////////////////////////////////

const mustacheExpress = require('mustache-express')
const session = require('express-session')
const { redirect } = require('express/lib/response')
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

// basic middleware
function logMiddleware(req, res, next) {
    next() // continue with original request
}

function authenticateMiddleware(req, res, next) {
    if (req.session) {
        if (req.session.username) {
            next()
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
}
app.use(logMiddleware)

app.use(express.urlencoded())

// everything inside public folder is available at root level
app.use(express.static('public'))

app.use(session({
    secret: 'tacocat',
    saveUninitialized: true,
    resave: true
}))

//app.use(authenticateMiddleware) - NO!

let users = [
    { username: 'johndoe', password: 'password' },
    { username: 'marydoe', password: 'password' }
]

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/login', (req, res) => {
    // get username/password from body
    const username = req.body.username
    const password = req.body.password

    const persistedUser = users.find(user => {
        return user.username == username && user.password == password
    })

    if (persistedUser) {
        // if username and password are matching
        if (req.session) {
            if (req.session.username = persistedUser.username) {
                res.redirect('/dashboard')
            }
        }
    } else {
        res.render('index', { errorMessage: 'Username or password is incorrect.' })
    }

    res.render('confirm')
})

app.get('/profile', authenticateMiddleware, (req, res) => {
    res.send('PROFILE')
})

app.get('/dashboard', authenticateMiddleware, (req, res) => {
    res.render('dashboard')
})

app.get('/profile', (req, res) => {
    // username? can't get - only accessed from login post route - need a session
    if (req.session) {
        username = req.session.username
        catName = req.session.catName
    }

    res.send(`Username is ${username} and cat name is ${catName}`)
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const name = req.body.name
    const age = req.body.age
    console.log(age)
    if (req.session) {
        req.session.name = name
        req.session.age = age
        res.redirect('/confirm')
    }
})

app.get('/confirm', (req, res) => {
    if (req.session) {
        username = req.session.name
        age = req.session.age
        console.log(age)
        let user = { name: username, age: age }
        res.render('confirm', user)
    }
})

//CHAT PAGE
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html')
})


// needs to be http for sockets
http.listen(3000, () => {
    console.log('Server is running!')
})


// app.get('/counter', (req, res) => {
//     if (req.session) {
//         if (req.session.counterButton == null) {
//             req.session.counterButton = 0
//         }
//         res.render('counter', { counterButton: req.session.counterButton })
//     } else {
//         res.render('counter')
//     }

// })

// app.post('/counter', (req, res) => {
//     if (req.session) {
//         req.session.counterButton += 1
//         // value.counter = parseInt(req.session.counterButton)
//         // value.counter += 1
//     }
//     res.redirect('/counter')

// })