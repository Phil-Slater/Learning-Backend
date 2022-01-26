const express = require('express')
const req = require('express/lib/request')
const app = express()
const mustacheExpress = require('mustache-express')

app.use(express.urlencoded())

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

let users = [
    {
        name: "John Doe",
        address: "789 Street"
    },
    {
        name: "Mary Doe",
        address: "1253 Shyreford"
    }
]

// localhost:3000
app.get('/users', (req, res) => {
    res.render('users', { allUsers: users })
})

app.post('/add-user', (req, res) => {
    const name = req.body.name
    const address = req.body.address

    const user = { name: name, address: address }
    users.push(user)
    res.redirect('/users')
})

app.get('/add-user', (req, res) => {
    res.render('add-user')
})

app.listen(3000, () => {
    console.log('Server is running...')
})