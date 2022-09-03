const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const db = require('./config/db')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded



app.get('/users', (req, res) => {
    const users = db.getUsers()
    users
        .then(data => res.json(data))
        .catch(error => console.log(error))
})

app.listen(3000, () => console.log(`Server running on PORT:${3000}`))