const db = require('../config/db')
const express = require('express')
const router = express.Router()


router.post('/signin', db.signin)

router.post('/signupUser', (req, res) => {
    console.log(req.body.birthDate)
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        birthDate: new Date()
    }
    console.log(user)
    const response = db.signupUser(user)
    response
        .then(data => res.json(data))
        .catch(error => console.log(error))
})

router.post('/signupAutonomous', (req, res) => {
    const userId = req.body.id
    const response = db.signupAutonomous(userId)
    response
        .then(data => res.json(data))
        .catch(error => console.log(error))
})

module.exports = router