const express = require('express')
,http = require('http')
,path = require('path')
,cors = require('cors')
,LIMIT = '100mb'
, compression = require('compression')
const app = express()
//cors
app.use(cors())
app.use(express.json({ limit: LIMIT }))
app.use(express.urlencoded({ limit: LIMIT, extended: true }))
app.use(compression())

app.use(express.static(path.join(__dirname,'dist')))

app.get('*',(req, res) =>{
    res.sendFile(path.join(__dirname,'./dist/index.html'))
})


const port = process.env.PORT || '3002'
app.set('port', port)

const server = http.createServer(app)
server.listen(port, () => console.log('Running port' + port))
