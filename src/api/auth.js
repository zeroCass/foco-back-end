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

router.post('/signin', (req, res) => {
    const user = {...req.body}

    //get the user in database
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
   
    const fetchData = async () => {
        try {
            const userId = await getUserId()
            // if user exists, then get the info based on type
            if (userId.length > 0) {
                const [ { id } ] = userId
                const values = ['autonomous', 'dependent', 'godparent']
                for (let value of values) {
                    let userType = await getUserType(id, value)
                    if (userType.length > 0) {
                        res.status(200).json(userType)
                        return
                    }
                }
                res.status(500).send('Usuario nao encontrado')
                return
            }
            res.status(500).send('Usuario nao encontrado')
        } catch (e) {
            console.log(e)
        }
        
    }
    fetchData()
    
    
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