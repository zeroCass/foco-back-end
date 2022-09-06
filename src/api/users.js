const db = require('../config/db')
const express = require('express')
const router = express.Router()

// get user columns by user TYPE
const getUserType = async (userId, type) => {
    try {
        return await new Promise((resolve, reject) => {
            const query = 
            `select * from (select name, email, id as 'idUser' from users) as u, (select * from ${type}) as a\
            where u.idUser = ? and a.id = u.idUser;`
            db.query(query, [userId], (err, result) => {
                if (err) reject(err)
                resolve(result)
            })

        })
    } catch (e) {
        console.log(e)
    }
}

router.get('/', (req, res) => {
    const query = 'select * from users;'
    db.query(query, (err, result) => {
            if (err) res.status(400).send({ err })
            res.status(200).json(result)
        })

})

router.get('/godparent/:id', (req, res) => {
    const query = 
        'select * from godparent\
        where godparent.id = ?;'
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send({ err })
            return
        }
        if (result.length === 0) {
            res.status(400).send(`Usuário com id:${req.params.id} não encontrado.`)
            return
        }
        console.log(result)
        res.status(200).json(result)
    })
})

router.get('/:id', (req, res) => {
    const query = 
        'select * from users\
        where users.id = ?;'
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send({ err })
            return
        }
        if (result.length === 0) {
            res.status(400).send(`Usuário com id:${req.params.id} não encontrado.`)
            return
        }
        res.status(200).json(result)
    })
})

router.get('/bytype/:id', (req, res) => {
    const userId = req.params.id
    const fetchData = async () => {
        try {
            const values = ['autonomous', 'dependent', 'godparent']
            for (let value of values) {
                let userType = await getUserType(userId, value)
                if (userType.length > 0) {
                    res.status(200).json(userType)
                    return
                }
            }
            res.status(500).send('Usuario nao encontrado')
            return
        } catch (e) {
            console.log(e)
        }
        
    }
    fetchData()
})

//updates xp and points for autonomous/dependent
router.put('/update/:id', (req, res) => {
    const data = req.body.data
    const userType = req.body.mainGodparent ? 'dependent':'autonomous'

    let responses = []
    for(let obj of data) {
        let [attr] = Object.keys(obj)
        let value = obj[attr]
        let query = 
            `update ${userType} set ${attr} = ${attr} + ?\
            where id = ?;`
        db.query(query, [value, req.params.id], (err, result) => {
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
