const express = require('express')
const bodyParser = require('body-parser')
const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.status(200).send('GET /')
})

app.get('/users', (req, res) => {
    res.status(200).send('GET /USERS')
})

app.listen(3000, () => console.log('server running'))