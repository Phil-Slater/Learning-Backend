
const express = require('express')
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const app = express()

let users = [
    {username: 'johndoe', password: 'password'}, 
    {username: 'marydoe', password: 'password'}
]

// basic middleware 
function logMiddleware(req, res, next) {
    console.log('MIDDLEWARE')
    next() // continue with the original request 
}

function authenticateMiddleware(req, res, next) {

    if(req.session) {
        if(req.session.username) {
            // send the user to their original request 
            next() 
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }

}

//app.use(logMiddleware)
app.use(express.urlencoded())

// initialize the session 
app.use(session({
    secret: 'THISSECRETKEY', 
    saveUninitialized: true, 
    resave: true 
}))

//app.use(authenticateMiddleware)

// setting up Express to use Mustache Express as template pages 
app.engine('mustache', mustacheExpress())
    // the pages are located in views directory
app.set('views', './views')
    // extension will be .mustache
app.set('view engine', 'mustache')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/counter', (req, res) => {

    if(req.session) {
        if(req.session.counterValue == null) {
            req.session.counterValue = 0 
        }
        res.render('counter',{counterValue: req.session.counterValue})
    } else {
        res.render('counter')
    }
})

app.post('/counter', (req, res) => {

    if(req.session) {
        req.session.counterValue += 1 
    }
    res.redirect('/counter')
})

app.get('/profile', authenticateMiddleware ,(req, res) => {
    res.send('PROFILE')
})

app.get('/dashboard', authenticateMiddleware, (req, res) => {
    res.render('dashboard')
})

app.post('/login', (req, res) => {
    
    // get username from body 
    const username = req.body.username 
    // get password from body 
    const password = req.body.password 

    const persistedUser = users.find(user => {
        return user.username == username && user.password == password
    })

    if(persistedUser) {
         // if username and password are matching 
        if(req.session) {
            req.session.username = persistedUser.username 
        }
        res.redirect('/dashboard')
    } else {
        res.render('index', {errorMessage: 'Username or password is invalid!'})
    }



})

app.get('/profile', (req, res) => {

    let username = ''

    if(req.session) {
        username = req.session.username
    }

    // username????
    res.send(`Username is ${username} and cat name is ${req.session.catName}`)
})

app.listen(3000,() => {
    console.log('Server is running...')
})