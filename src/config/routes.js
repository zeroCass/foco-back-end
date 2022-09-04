const users = require('../api/users')
const autonomous = require('../api/autonomous')
const tasks = require('../api/tasks')
const auth = require('../api/auth')

module.exports = app => {
    app.use('/users', users)
    app.use('/autonomous', autonomous)
    app.use('/tasks', tasks)
    app.use('/auth', auth)
}