const db = require('../config/db')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    const users = db.getUsers()
    users
        .then(data => res.json(data))
        .catch(error => console.log(error))
})


module.exports = router
