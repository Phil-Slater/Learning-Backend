const express = require('express')
const router = express.Router()
const authenticateMiddleware = require('../authenticate')

router.get('/', (req, res) => {
    res.render('users')
})

router.get('/profile', authenticateMiddleware, (req, res) => {
    res.render('profile')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const username = req.body.username
    const password1 = req.body.password1
    const password2 = req.body.password2
    if (users.find(user => user.username == username)) {
        res.render('register', { errorMessage: "That username is already taken. Please try again." })
    } else if (password1 != password2) {
        res.render('register', { errorMessage: "Passwords do not match. Please try again." })
    } else {
        user = { username: username, password: password1, userId: users.length + 1 }
        users.push(user)
        res.redirect('/users/login')
    }
})

router.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const persistedUser = users.find(user => {
        return user.username == username && user.password == password
    })
    if (persistedUser) {
        if (req.session) {
            if (req.session.username = persistedUser.username) {
                res.redirect('/users/profile')
            }
        } else {
            res.render('login', { errorMessage: 'Username or password is incorrect.' })
        }
    }
})

router.get('/sign-out', (req, res) => {
    req.session.destroy()
    res.redirect('/users')
})

module.exports = router