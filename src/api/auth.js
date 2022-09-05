const db = require('../config/db')
const express = require('express')
const router = express.Router()


router.post('/signin', (req, res) => {
    const user = {...req.body}
    const type = req.body.type

    const getUserId = async () => {
        try {
            return await new Promise((resolve, reject) => {
                const query = 
                    'select id from users\
                    where users.email = ? and users.userPassword = ?'
                db.query(query, [user.email, user.password], (err, result) => {
                    if (err)
                        reject(err)
                    resolve(result)
                })
            })
        }catch (e) {
            console.log(e)
        }
    }

    const getUserType = async (userId) => {
        try {
            return await new Promise((resolve, reject) => {
                const query = 
                `select u.name, u.email, a.xp, a.points from users u, ${type} a\
                where u.id = ? and u.id = a.id;`
                db.query(query, [userId], (err, result) => {
                    if (err)
                        reject(err)
                    resolve(result)
                })
            })
        } catch(e) {
            console.log(e)
        }
        
    }

    getUserId()
    .then(data => {
            if (data.length === 0) throw 'Usuario não encontrado.'
            const [ { id } ] = data
            getUserType(id)
            .then(data => res.status(200).json(data))
        })
    .catch(e => res.status(400).send(e))
    
})

router.post('/signup', (req, res) => {
    const user = {...req.body}
    const type = req.body.type

    // get the userId returned at the promisse
    const insertUser = async () => {
        try {
            return await new Promise((resolve, reject) => {
                const query = 
                    'insert into users (name, email, userPassword, birthDate)\
                    values(?, ?, ?, ?)'
                db.query(query, [user.name, user.email, user.password, user.birthDate], (err, result) => {
                    if (err)
                        reject(err)
                    resolve(result)
                })
            })
        }catch (e) {
            console.log(e)
        }
    }

    const insertUserbyType = async (userId) => {
        try {
            return await new Promise((resolve, reject) => {
                let values
                let query
                if (type === 'autonomous') {
                    values = [userId, 0, 0]
                    query = 'insert into autonomous (id, xp, points) values (?, ?, ?)'
                }

                if (type === 'godparent') {
                    values = [userId, user.descr]
                    query = 'insert into godparent (id, descr) values (?, ?)'
                }

                if (type === 'dependent') {
                    values = [userId, 0, 0, user.mainGodparent]
                    query = 'insert into dependent (id, xp, points, mainGodparent) values (?, ?, ?, ?)'
                }

                db.query(query, values, (err, result) => {
                    if (err)
                        reject(err)
                    resolve(result)
                })
            })
        } catch(e) {
            console.log(e)
        }
    }

    insertUser()
    .then((data) => {
        if (!data.insertId) throw 'Algo deu errado.'
        insertUserbyType(data.insertId)
            .then(data => {
                if (!data.insertId) throw 'Algo deu errado.'
                res.status(200).json(data.insertId)
            })
    })
    .catch(e => res.status(500).send(e))
})

module.exports = router