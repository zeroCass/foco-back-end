const mysql = require('mysql2')

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
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


//users
const getUsers = async () => {
    // return Object.values(users) || {}
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 'select * from users;'
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

const getUser = async (userId) => {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 'select * from users where id = ?;'
            db.query(query, [userId], (err, result) => {
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

const addUser = async (user) => {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 'insert into users (name, email, userPassword, birthDate) values (?, ?, ?, ?);'
            db.query(query, [user.name, user.email, user.password, new Date(user.birthDate)], (err, result) => {
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

// autonomous
const getAutonomous = async (userId) => {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 
                'select users.id, name, email, points, xp from users, autonomous \
                where users.id = ? and users.id = autonomous.id;'
            db.query(query, [userId], (err, result) => {
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

const addAutonomous = async (userId) => {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 'insert into autonomous (id, points, xp) values (?, ?, ?);'
            db.query(query, [userId, 0, 0,], (err, result) => {
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

//tasks
const getTasks = async (userId) => {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 'select * from tasks where tasks.belongId = ?;'
            db.query(query, [userId], (err, result) => {
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

const addTask = async (task) => {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 
                'insert into tasks (createId, belongId, name, descr, estimateDate, \
                    initDate, doneAt, startAt, priority, difficulty, category, isActive, expired, missionId) \
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
            db.query(query, [task.createId, task.belongId, task.name, task.desc, task.estimateDate, task.initDate,
                task.doneAt, task.startAt, task.priority, task.difficulty, task.category, task.isActive, task.expired, task.missionId ], (err, result) => {
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


//auth
const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) return res.status(400).send('Dados incompletos')
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 
                'select * from users where users.email = ? and users.userPassword = ?;'
            db.query(query, [req.body.email, req.body.password], (err, result) => {
                if (err) reject(new Error(err.message))
                resolve(result)
            })
        })
        console.log([...response])
        if (response.length === 0)
            return res.status(400).send('Credenciais inválidas')
        const [user] = response
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            birthDate: user.birthDate,
        })
    } catch (error) {
        console.log(error)
    }
}

const signupUser = async (user) => {
    console.log(user)
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 
                'insert into users (name, email, userPassword, birthDate) \
                 values (?, ?, ?, ?);'
            db.query(query, [user.name, user.email, user.password, user.birthDate], (err, result) => {
                if (err) reject(new Error(err.message))
                resolve(result)
            })
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

const signupAutonomous = async (userId) => {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = 
                'insert into autonomous (id, points, xp) \
                 values (?, ?, ?);'
            db.query(query, [userId, 0, 0], (err, result) => {
                if (err) reject(new Error(err.message))
                resolve(result)
            })
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    getAutonomous,
    addAutonomous,
    getTasks,
    addTask,
    signin,
    signupUser,
    signupAutonomous,
}