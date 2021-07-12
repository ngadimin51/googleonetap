'use strict'

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const path = require('path')

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(3000, console.log('server listen port 3000'))