require('dotenv').config()
const express = require('express')
const app = express()
const middlewares = require('./config/middlewares')
const routes = require('./config/routes')

// import all middlewares
middlewares(app)
// import all routes
routes(app)

// start the server
app.listen(process.env.SERVER_PORT, () => console.log(`Server running on PORT:${process.env.SERVER_PORT}`))

