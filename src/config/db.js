const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 33306,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})



db.connect(err => {
    if (err) {
        console.log('Connection faild. ',err.stack)
        return
    }
    console.log('Connected as id: ', db.threadId)
})


const getUsers = async () => {
    // return Object.values(users) || {}
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 'select * from pessoa;'
            db.query(query, (err, result) => {
                    if (err) reject(new Error(err.message))
                    resolve(result)
                })
            })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {
    getUsers,
}