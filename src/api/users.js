const db = require('../config/db')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    const query = 'select * from users;'
    db.query(query, (err, result) => {
            if (err) res.status(400).send({ err })
            res.status(200).json(result)
        })

})

router.get('/:id', (req, res) => {
    const query = 
        'select * from users\
        where users.id = ?;'
    db.query(query, [req.params.id], (err, result) => {
        if (err) 
            res.status(500).send({ err })
        if (result.length === 0)
            res.status(400).send(`Usuário com id:${req.params.id} não encontrado.`)
         res.status(200).json(result)
    })
})

module.exports = router
