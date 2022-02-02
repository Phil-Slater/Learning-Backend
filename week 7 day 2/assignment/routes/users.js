const bcrypt = require('bcryptjs/dist/bcrypt')
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
    if (password1 != password2) {
        res.render('register', { errorMessage: "Passwords do not match. Please try again." })
    } else {
        bcrypt.genSalt(10, (error, salt) => {
            if (!error) {
                bcrypt.hash(password1, salt, (error, hash) => {
                    if (!error) {
                        db.none('INSERT INTO trip_users(username, password) VALUES ($1, $2)', [username, hash])
                            .then(() => {
                                res.redirect('/users/login')
                            })

                    }
                })
            }
        })
    }
})

router.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    db.one('SELECT user_id, username, password FROM trip_users WHERE username = $1', [username]).then((user) => {
        bcrypt.compare(password, user.password, (error, result) => {
            if (result) {
                // setup a user session
                if (req.session) {
                    req.session.username = user.username
                    req.session.userId = user.user_id
                }
                res.redirect('/users/profile')
            } else {
                res.render('login', { errorMessage: 'Incorrect password.' })
            }
        })
    }).catch((error) => {
        res.render('login', { errorMessage: 'Username not found!' })
    })
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
    const userId = req.session.userId
    db.any('SELECT post_id, username, post_title, post_body, date_created, date_updated from blog_posts WHERE username = $1', [username])
        .then(posts => {
            res.render('blog', { userPosts: posts })
        })
})

router.get('/blog/view-comments/:postId', authenticateMiddleware, (req, res) => {
    const postId = parseInt(req.params.postId)
    db.any('SELECT comment_body, username, date_created, comment_id FROM blog_comments WHERE post_id = $1', [postId])
        .then(comments => {
            res.render('view-comments', { allComments: comments })
        })
})

router.post('/blog/delete-comment/:commentId', (req, res) => {
    const commentId = parseInt(req.params.commentId)
    db.none('DELETE from blog_comments WHERE comment_id = $1', [commentId])
        .then(() => {
            res.redirect('/users/blog')
        })
})

router.get('/update-blog-post/:postId', authenticateMiddleware, (req, res) => {
    const postId = parseInt(req.params.postId)
    db.one('SELECT post_id, username, post_title, post_body from blog_posts WHERE post_id = $1', [postId])
        .then(post => {
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
            db.none('DELETE from blog_comments WHERE post_id = $1', [postId])
                .then(() => {
                    res.redirect('/users/blog')
                })
        })
})

router.get('/site-blog', (req, res) => {
    db.any('SELECT post_id, username, post_title, post_body, date_created, date_updated FROM blog_posts')
        .then((posts) => {
            res.render('site-blog', { allPosts: posts })
        })
})

router.post('/site-blog/add-comment/:postId', authenticateMiddleware, (req, res) => {
    const postId = parseInt(req.params.postId)
    const comment = req.body.commentText
    const username = req.session.username
    db.none('INSERT INTO blog_comments(comment_body, post_id, username) VALUES($1, $2, $3)', [comment, postId, username])
        .then(() => {
            res.redirect('/users/site-blog')
        })
})

router.get('/site-blog/show-comments/:postId', (req, res) => {
    const postId = parseInt(req.params.postId)
    db.any('SELECT comment_body, blog_comments.date_created, blog_comments.username AS commenterUserName FROM blog_comments JOIN blog_posts ON blog_comments.post_id = blog_posts.post_id WHERE blog_comments.post_id = $1', [postId])
        .then((comments) => {
            db.any('SELECT username, post_title, post_body, date_created, date_updated, post_id FROM blog_posts WHERE post_id = $1', [postId])
                .then((post) => {
                    res.render('blog-post-details', { allComments: comments, post: post })
                })
        })
})

router.get('/site-blog/sort-posts-by-date', (req, res) => {
    db.any('SELECT * FROM blog_posts ORDER BY date_updated DESC')
        .then((posts) => {
            res.render('site-blog', { allPosts: posts })
        })
})

// router.get('/site-blog/sort-posts-by-comments', (req, res) => {
//     db.any('SELECT * FROM blog_comments ORDER BY date_updated DESC')
//         .then((posts) => {
//             res.render('site-blog', { allPosts: posts })
//         })
// })


router.get('/sign-out', (req, res) => {
    req.session.destroy()
    res.redirect('/users')
})



module.exports = router