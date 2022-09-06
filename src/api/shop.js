const db = require('../config/db')
const express = require('express')
const moment = require('moment')
const router = express.Router()

//get all items by userid (not redeemed)
router.get('/:id', (req, res) => {
    const query = 
    'select * from rewards \
    where userId = ? and redeemed = false'
    db.query(query, [req.params.id], (err, result) => {
        if (err) res.status(400).send('Reward Not found')
        res.status(200).json(result)
    })
})

//post new item
router.post('/', (req, res) => {
    const item = {...req.body}
    const query = 
        `insert into rewards (name, price, userId, createId, redeemed)\
        values (?, ?, ?, ?, ?)`
    db.query(query, [item.name, item.price, item.userId, item.createId, false], (err, result) => {
        if (err) res.status(400).send()
        res.status(200).json(result)
    })
})

//put item as redeemed
router.put('/:id', (req, res) => {
    const query = 
        'update rewards set redeemed = ?\
        where id = ?'
    db.query(query, [true, req.params.id], (err, result) => {
        if (err) res.status(400).send()
        res.status(200).json(result)
    })
})

module.exports = router