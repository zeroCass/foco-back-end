const mysql = require('mysql2')

const db = mysql.createConnection({
    host: '54.233.129.48',
    user: 'ubuntu',
    password: 'mysql_EC2',
    database: 'teste'
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