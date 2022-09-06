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
    const query = 'select * from missions where missions.belongId = ?;'
    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(500).json(err)
            return 
        }
        res.status(200).json(result)
    })
})

router.post('/', (req, res) => {
    const mission = convertDateType({...req.body}) 
    const query = 
            'insert into missions (createId, belongId, name, estimateDate, \
                initDate, doneAt, startAt, priority, difficulty, category, isActive, expired) \
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    db.query(query, [mission.createId, mission.belongId, mission.name, mission.estimateDate, mission.initDate,
        mission.doneAt, mission.startAt, mission.priority, mission.difficulty, mission.category, mission.isActive, mission.expired ], (err, result) => {
        if (err) res.status(500).json(err)
        res.status(200).json(result)
    })
})

// updates a mission specify by id
router.put('/:id', (req, res) => {
    const missionId = req.params.id
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
        `update missions m
        set m.${attr} = ?
        where m.id = ?`
        
        db.query(query, [defData, missionId], (err, result) => {
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