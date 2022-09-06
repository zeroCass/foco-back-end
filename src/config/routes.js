const users = require('../api/users')
const tasks = require('../api/tasks')
const auth = require('../api/auth')
const missions = require('../api/missions')
const shop = require('../api/shop')

module.exports = app => {
    app.use('/users', users)
    app.use('/tasks', tasks)
    app.use('/auth', auth)
    app.use('/missions', missions)
    app.use('/shop', shop)
}