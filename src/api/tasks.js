const db = require('../config/db')
const express = require('express')
const router = express.Router()

// get all tasks by userID
router.get('/:id', (req, res) => {
    const userId = req.params.id
    const query = 'select * from tasks where tasks.belongId = ?;'
    db.query(query, [userId], (err, result) => {
        if (err)
            res.status(500).json(err)
        res.status(200).json(result)
    })
})

router.post('/', (req, res) => {
    const task = {...req.body}
    const query = 
            'insert into tasks (createId, belongId, name, descr, estimateDate, \
                initDate, doneAt, startAt, priority, difficulty, category, isActive, expired, missionId) \
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    db.query(query, [task.createId, task.belongId, task.name, task.desc, task.estimateDate, task.initDate,
        task.doneAt, task.startAt, task.priority, task.difficulty, task.category, task.isActive, task.expired, task.missionId ], (err, result) => {
        if (err) res.status(500).json(err)
        res.status(200).json(result)
    })
})

module.exports = router