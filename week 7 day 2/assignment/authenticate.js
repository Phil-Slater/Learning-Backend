const authenticateMiddleware = (req, res, next) => {
    if (req.session) {
        if (req.session.username) {
            next()
        } else {
            res.redirect('/users/login')
        }
    } else {
        res.redirect('/users/login')
    }
}

module.exports = authenticateMiddleware