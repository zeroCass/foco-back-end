const users = require('../api/users')

module.exports = app => {
    app.use('/users', users)
}