const express = require('express')
const req = require('express/lib/request')
const app = express()
const mustacheExpress = require('mustache-express')
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.urlencoded())
const moviesRouter = require('./routes/movies')
app.use('/movies', moviesRouter)

//app.use(express.static('static'))

global.movies = [{ title: "The Dark Knight", description: "With the help of allies Lt. Jim Gordon (Gary Oldman) and DA Harvey Dent (Aaron Eckhart), Batman (Christian Bale) has been able to keep a tight lid on crime in Gotham City. But when a vile young criminal calling himself the Joker (Heath Ledger) suddenly throws the town into chaos, the caped Crusader begins to tread a fine line between heroism and vigilantism.", genre: "Action", posterURL: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg", movieId: 1 }]

app.listen(3000, () => {
    console.log('Server is running!')
})