const db = require('../config/db')
const express = require('express')
const router = express.Router()

// get all tasks by userID
router.get('/:id', (req, res) => {
    const userId = req.params.id
    const tasks = db.getTasks(userId)
    tasks
        .then(data => res.json(data))
        .catch(error => console.log(error))
})

router.post('/', (req, res) => {
    const task = {
        createId: req.body.createId,
        belongId: req.body.belongId,
        name: req.body.name,
        desc: req.body.desc,
        estimateDate: req.body.estimateDate,
        initDate: req.body.initDate,
        startAt: req.body.startAt,
        doneAt: req.body.doneAt,
        priority: req.body.priority,
        category: req.body.category,
        difficulty: req.body.difficulty,
        isActive: req.body.isActive,
        expired: req.body.expired,
        missionId: req.body.missionId,
    }
    const response = db.addTask(task)
    response
        .then(data => res.json(data))
        .catch(error => console.log(error))
})

module.exports = router