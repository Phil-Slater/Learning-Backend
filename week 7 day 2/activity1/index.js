const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const session = require('express-session');
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }))

app.use(express.urlencoded())

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

let customers = []

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/add-customer', (req, res) => {
    const name = req.body.name
    const age = req.body.age
    const customer = { name: name, age: age }
    customers.push(customer)
    res.redirect('/confirmation')
})

app.get('/confirmation', (req, res) => {
    res.render('confirmation', { allCustomers: customers })
})

app.get('/add-customer', (req, res) => {
    res.render('add-customer')
})

app.listen(3000, () => {
    console.log('Server is running...')
})