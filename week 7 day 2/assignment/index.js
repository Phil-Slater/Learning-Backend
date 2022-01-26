const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')

app.use(express.urlencoded())

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

let trips = [{ title: "Honeymoon", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/10/74/8b/bungalows-facing-mont.jpg?w=900&h=600&s=1", city: "Tahiti", departureDate: "2022-05-06", returnDate: "2022-05-18", tripId: 1 }]

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/add-trip', (req, res) => {
    res.render('add-trip')
})

// getting default values for input boxes on update-trip page
app.get('/update-trip/:tripId', (req, res) => {
    const id = parseInt(req.params.tripId)
    let trip = trips.find(trip => trip.tripId == id)
    res.render('update-trip', trip)
})

app.post('/update-trip/:tripId', (req, res) => {
    const id = parseInt(req.params.tripId)
    const updatedTitle = req.body.tripTitle
    const updatedImage = req.body.imageURL
    const updatedCity = req.body.city
    const updatedDepartureDate = req.body.departureDate
    const updateReturnDate = req.body.returnDate
    let trip = trips.find(trip => trip.tripId == id)
    trip.title = updatedTitle
    trip.image = updatedImage
    trip.city = updatedCity
    trip.departureDate = updatedDepartureDate
    trip.returnDate = updateReturnDate
    res.redirect('/view-trips')
})

app.get('/view-trips', (req, res) => {
    res.render('view-trips', { allTrips: trips })
})

app.post('/add-trip', (req, res) => {
    const tripTitle = req.body.tripTitle
    const imageURL = req.body.imageURL
    const city = req.body.city
    const departureDate = req.body.departureDate
    const returnDate = req.body.returnDate
    const trip = { title: tripTitle, image: imageURL, city: city, departureDate: departureDate, returnDate, returnDate, tripId: trips.length + 1 }
    trips.push(trip)
    res.redirect('/view-trips')
})

app.post('/view-trips', (req, res) => {
    let tripsSorted = trips.sort((a, b) => {
        return new Date(a.departureDate) - new Date(b.departureDate)
    })
    res.render('view-trips', { allTrips: tripsSorted })
})

app.get('/search', (req, res) => {
    res.render('search')
})

app.post('/search', (req, res) => {
    const citySearched = req.body.citySearchBox
    const trip = trips.filter(trip => trip.city == citySearched)
    res.render('search', { allTrips: trip })
})

app.listen(3000, () => {
    console.log('Server is running...')
})