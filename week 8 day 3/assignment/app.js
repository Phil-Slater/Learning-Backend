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
    }).catch(error => {
        res.render('create-post', { errorMessage: 'Unable to save post!' })
    })
})

// ASYNC and AWAIT

// also add async before (req, res)
// // save movie using async/await 
// try {
//     let savedMovie = await movie.save()
//     res.redirect('/')
// } catch(error) {
//     res.render('add-movie', {errorMessage: 'Unable to save movie!'})
// }

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

app.post('/add-comment/:id', (req, res) => {
    const postId = parseInt(req.params.id)
    const title = req.body.commentTitle
    const body = req.body.commentBody

    const comment = models.Comments.build({
        post_id: postId,
        title: title,
        body: body
    })

    comment.save().then(() => {
        res.redirect(`/comments/${postId}`)
    })
})

app.get('/comments/:id', (req, res) => {
    const postId = parseInt(req.params.id)
    models.Posts.findByPk(postId, {
        include: [
            {
                model: models.Comments,
                as: 'comments'
            }
        ]
    }).then(post => {
        res.render('view-comments', post.dataValues)
    })
})

app.post('/delete-comment/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const postId = parseInt(req.body.post_id)
    models.Comments.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect(`/comments/${postId}`)
    })
})

app.listen(3000, () => {
    console.log('Server is running...')
})