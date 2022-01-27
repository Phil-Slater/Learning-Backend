const express = require('express')
const router = express.Router()
module.exports = router

router.get('/', (req, res) => {
    res.render('index', { allMovies: movies })
})

router.get('/create', (req, res) => {
    res.render('create')
})

router.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description
    const genre = req.body.genre
    const posterURL = req.body.posterURL
    let movie = { title: title, description: description, genre: genre, posterURL: posterURL, movieId: movies.length + 1 }
    movies.push(movie)
    res.redirect('/movies')
})

router.get('/genre', (req, res) => {
    res.render('genre')
})

router.post('/delete-movie', (req, res) => {
    const movieId = req.body.movieId
    movies = movies.filter(movie => movie.movieId != movieId)
    res.redirect('/movies')
})

router.get('/details/:movieId', (req, res) => {
    const movieId = parseInt(req.params.movieId)
    let movie = movies.find(movie => movie.movieId == movieId)
    res.render('details', movie)
})

router.get('/api', (req, res) => {
    res.json(movies)
})

router.post('/genre/', (req, res) => {
    const genre = req.body.genreSearchBox
    const movie = movies.filter(movie => movie.genre.toLowerCase() == genre.toLowerCase())
    res.render('genre', { allMovies: movie })
})