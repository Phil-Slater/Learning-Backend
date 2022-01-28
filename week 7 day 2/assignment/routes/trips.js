const express = require('express')
const router = express.Router()
const authenticateMiddleware = require('../authenticate')

router.get('/view-trips', authenticateMiddleware, (req, res) => {
    let userTrips = trips.filter(trip => trip.username == req.session.username)
    res.render('view-trips', { allTrips: userTrips })
})

router.get('/', (req, res) => {
    res.redirect('/users')
})

router.get('/add-trip', authenticateMiddleware, (req, res) => {
    res.render('add-trip')
})

router.get('/update-trip/:tripId', (req, res) => {
    const id = parseInt(req.params.tripId)
    if (req.session) {
        if (trips.find(trip => trip.username == req.session.username && trip.tripId == id)) {
            let trip = trips.find(trip => trip.tripId == id)
            res.render('update-trip', trip)
        } else {
            res.redirect('/users/login')
        }
    } else {
        res.redirect('/users/login')
    }
})

router.post('/update-trip/:tripId', (req, res) => {
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
    res.redirect('/trips/view-trips')
})

router.post('/add-trip', (req, res) => {
    const tripTitle = req.body.tripTitle
    const imageURL = req.body.imageURL
    const city = req.body.city
    const departureDate = req.body.departureDate
    const returnDate = req.body.returnDate
    const trip = { title: tripTitle, image: imageURL, city: city, departureDate: departureDate, returnDate, returnDate, tripId: trips.length + 1, username: req.session.username }
    trips.push(trip)
    res.redirect('/trips/view-trips')
})

router.post('/view-trips', (req, res) => {
    let tripsSorted = trips.sort((a, b) => {
        return new Date(a.departureDate) - new Date(b.departureDate)
    })
    res.render('view-trips', { allTrips: tripsSorted })
})

router.get('/search', authenticateMiddleware, (req, res) => {
    res.render('search')
})

router.post('/search', (req, res) => {
    const citySearched = req.body.citySearchBox
    const username = req.session.username
    const trip = trips.filter(trip => trip.city == citySearched && trip.username == username)
    res.render('search', { allTrips: trip })
})

router.post('/delete-trip', (req, res) => {
    const id = req.body.tripId
    trips = trips.filter(trip => trip.tripId != id)
    console.log(trips)
    res.redirect('/trips/view-trips')
})

module.exports = router
