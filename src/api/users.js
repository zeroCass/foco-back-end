const db = require('../config/db')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    const users = db.getUsers()
    users
        .then(data => res.json(data))
        .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
    const user = db.getUser(req.params.id)
    user.then(data => res.json(data))
        .catch(error => console.log(error))
})

router.post('/', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,  
        password: req.body.password,
        birthDate: req.body.birthDate
    }
    console.log('user', user)
    const response = db.addUser(user)
        response.then(data => res.json(data))
                .catch(error => console.log(error))
})

module.exports = router
