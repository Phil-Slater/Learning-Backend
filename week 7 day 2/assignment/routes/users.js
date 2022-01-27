const express = require('express')
const router = express.Router()

// /users
router.get('/', (req, res) => {
    res.send('USERS')
})

router.get('/profile', (req, res) => {
    res.send('PROFILE')
})


module.exports = router