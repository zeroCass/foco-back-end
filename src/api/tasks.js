const db = require('../config/db')
const express = require('express')
const { reset } = require('nodemon')
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

// updates a task specify by id
router.put('/:id', (req, res) => {
    const taskId = req.params.id
    const attr = req.body.attr
    const data = req.body.data

    const query = 
        `update tasks t
        set t.${attr} = ?
        where t.id = ?`
    db.query(query, [data, taskId], (err, result) => {
        if (err) {
            res.status(400).json(err)
            return
        }
        console.log(result)
        res.status(200)
    })
})

module.exports = router