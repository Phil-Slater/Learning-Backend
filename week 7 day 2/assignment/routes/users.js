const express = require('express')
const router = express.Router()
const authenticateMiddleware = require('../authenticate')



router.get('/', (req, res) => {
    res.render('users')
})

router.get('/profile', authenticateMiddleware, (req, res) => {
    res.render('profile')
})

router.get('/chat', authenticateMiddleware, (req, res) => {
    const username = req.session.username
    const user = { username: username }
    chatUsers.push(user)
    res.render('chat', { username: username, allMessages: chatMessages, chatUsers: chatUsers })
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

router.get('/add-blog-post', authenticateMiddleware, (req, res) => {
    res.render('add-blog-post')
})

router.post('/add-blog-post', (req, res) => {
    const username = req.session.username
    const postTitle = req.body.postTitle
    const postBody = req.body.postBody
    db.none('INSERT INTO blog_posts(username, post_title, post_body) VALUES($1, $2, $3)', [username, postTitle, postBody])
        .then(() => {
            res.redirect('/users/blog')
        })

})

router.get('/blog', authenticateMiddleware, (req, res) => {
    const username = req.session.username
    db.any('SELECT post_id, username, post_title, post_body, date_created, date_updated from blog_posts')
        .then(posts => {
            const userPosts = posts.filter(post => post.username == username)
            res.render('blog', { userPosts: userPosts })
        })
})

router.get('/update-blog-post/:postId', authenticateMiddleware, (req, res) => {
    const postId = parseInt(req.params.postId)
    db.one('SELECT post_id, username, post_title, post_body from blog_posts WHERE post_id = $1', [postId])
        .then(post => {
            console.log(post)
            if (req.session.username == post.username) { res.render('update-blog-post', post) }
            else {
                res.redirect('/users/login')
            }
        })
})

router.post('/update-blog-post/:postId', (req, res) => {
    const postId = parseInt(req.params.postId)
    const postTitle = req.body.postTitle
    const postBody = req.body.postBody
    const updatedDate = new Date()
    db.none('UPDATE blog_posts SET post_title = $1, post_body = $2, date_updated = $3 WHERE post_id = $4', [postTitle, postBody, updatedDate, postId])
        .then(() => {
            res.redirect('/users/blog')
        })
})

router.post('/delete-blog-post/:postId', (req, res) => {
    const postId = parseInt(req.params.postId)
    db.none('DELETE FROM blog_posts WHERE post_id = $1', [postId])
        .then(() => {
            res.redirect('/users/blog')
        })
})

router.get('/sign-out', (req, res) => {
    req.session.destroy()
    res.redirect('/users')
})

module.exports = router