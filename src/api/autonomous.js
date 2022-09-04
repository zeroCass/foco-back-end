const db = require('../config/db')
const express = require('express')
const router = express.Router()


router.get('/:id', (req, res) => {
    const autonomous = db.getAutonomous(req.params.id)
    autonomous
        .then(data => res.json(data))
        .catch(error => console.log(error))
})

router.post('/:id', (req, res) => {
    const userId = req.params.id
    const response = db.addAutonomous(userId)
    response
        .then(data => res.json(data))
        .catch(error => console.log(error))
})

module.exports = router