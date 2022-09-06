const db = require('../config/db')
const express = require('express')
const moment = require('moment')
const router = express.Router()


const convertDateType = (task) => {
    const ctask = {...task}
    ctask.estimateDate ? 
        ctask.estimateDate = moment(ctask.estimateDate).format('YYYY-MM-DD HH:mm:ss'): ctask.estimateDate = null
    ctask.initDate ? 
        ctask.initDate = moment(ctask.initDate).format('YYYY-MM-DD HH:mm:ss') : ctask.initDate = null
    ctask.doneAt ? 
        ctask.doneAt = moment(ctask.doneAt).format('YYYY-MM-DD HH:mm:ss') : ctask.doneAt = null
    ctask.startAt ? 
        ctask.startAt = moment(ctask.startAt).format('YYYY-MM-DD HH:mm:ss') : ctask.startAt = null
    return ctask
}

// get all tasks by userID
router.get('/:id', (req, res) => {
    const userId = req.params.id
    const query = 'select * from tasks where tasks.belongId = ?;'
    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(500).json(err)
            return 
        }
        res.status(200).json(result)
    })
})

router.post('/', (req, res) => {
    const task = convertDateType({...req.body})  
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

//get all tasks by missionId
router.get('/mission/:id', (req, res) => {
    const userId = req.params.id
    const query = 'select * from tasks where tasks.missionId = ?;'
    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(500).json(err)
            return 
        }
        res.status(200).json(result)
    })
})


// updates a task specify by id
router.put('/:id', (req, res) => {
    const taskId = req.params.id
    const attributes = req.body.attr
    const datas = req.body.data
    
    const form = 'YYYY-MM-DD HH:mm:ss'
    let responses = []
    for(let idx in attributes) {
        let data = datas[idx]
        let attr = attributes[idx]

        // convert data date values to mysql pattern
        let dateData = attr === 'estimateDate ' ? moment(data).format(form) 
            : attr === 'doneAt' ? moment(data).format(form)
            : attr === 'initDate' ? moment(data).format(form)
            : attr === 'startAt' ? moment(data).format(form)
            : null
        // set the data boolean types if it is string
        let defData = dateData !== null ? dateData 
            : data == 'false'  ? false : data == 'true' ? true : data

        let query = 
        `update tasks t
        set t.${attr} = ?
        where t.id = ?`
        
        db.query(query, [defData, taskId], (err, result) => {
            if (err) {
                responses.push(false)
                return
            }
            responses.push(true)
        })


    }

    if (responses.includes(false)) {
        res.status(400).send('Error.')
        return
    }
    res.status(200).send('Ok.')

})

module.exports = router