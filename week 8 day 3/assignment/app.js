const express = require('express')
const models = require('./models')

const app = express()
const mustacheExpress = require('mustache-express')

// var bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


const { Op } = require('sequelize')
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.urlencoded())

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/create-post', (req, res) => {
    res.render('create-post')
})

app.post('/create-post', (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category
    const post = models.Posts.build({
        title: title,
        body: body,
        category: category
    })
    post.save().then(() => {
        res.redirect('/')
    })
})

app.get('/view-all-posts', (req, res) => {
    models.Posts.findAll({})
        .then(posts => {
            res.render('index', { allPosts: posts })
        })
})

app.get('/update-post/:id', (req, res) => {
    const id = req.params.id
    models.Posts.findAll({
        where: {
            id: id
        }
    }).then(post => {
        res.render('update-post', { post: post })
    })
})

app.post('/update-post/:id', (req, res) => {
    const id = req.params.id
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category
    models.Posts.update({
        title: title,
        body: body,
        category: category
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/delete-post/:id', (req, res) => {
    const id = req.params.id
    models.Posts.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.render('index')
    })
})

app.post('/filter-posts', (req, res) => {
    const keyword = req.body.keyword
    models.Posts.findAll({
        where: {
            category: {
                [Op.iLike]: keyword
            }
        }
    }).then(posts => {
        res.render('index', { allPosts: posts })
    })
})

app.listen(3000, () => {
    console.log('Server is running...')
})