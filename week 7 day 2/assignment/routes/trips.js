const express = require('express')
const router = express.Router()


router.get('/view-trips', (req, res) => {
    res.render('view-trips', { allTrips: trips })
})

// now points to trips/
router.get('/', (req, res) => {
    res.render('index')
})
// localhost:3000/trips/add-trip
router.get('/add-trip', (req, res) => {
    res.render('add-trip')
})

// getting default values for input boxes on update-trip page
// localhost:3000/trips/add-trip/update-trip/:tripId
router.get('/update-trip/:tripId', (req, res) => {
    const id = parseInt(req.params.tripId)
    let trip = trips.find(trip => trip.tripId == id)
    res.render('update-trip', trip)
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
    const trip = { title: tripTitle, image: imageURL, city: city, departureDate: departureDate, returnDate, returnDate, tripId: trips.length + 1 }
    trips.push(trip)
    res.redirect('/trips/view-trips')
})

router.post('/view-trips', (req, res) => {
    let tripsSorted = trips.sort((a, b) => {
        return new Date(a.departureDate) - new Date(b.departureDate)
    })
    res.render('view-trips', { allTrips: tripsSorted })
})

router.get('/search', (req, res) => {
    res.render('search')
})

router.post('/search', (req, res) => {
    const citySearched = req.body.citySearchBox
    const trip = trips.filter(trip => trip.city == citySearched)
    res.render('search', { allTrips: trip })
})

router.post('/delete-trip', (req, res) => {
    const id = req.body.tripId
    trips = trips.filter(trip => trip.tripId != id)
    res.redirect('/trips/view-trips')
})

router.get('/:city', (req, res) => {
    res.send(`<h1 style="text-transform:capitalize">${req.params.city}</h1>`)
})

//now other files can import router
module.exports = router
