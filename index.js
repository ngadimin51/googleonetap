'use strict'

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const path = require('path')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

server.listen(3000, console.log('Server listen port '+ 3000))