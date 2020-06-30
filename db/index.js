
require('dotenv');
const mongoose = require('mongoose')
const config = require('../config')
// const {port, host, dbName, mongo} = config.db

const connection = mongoose.connection

connection.once('open', () => {
    console.log('MongoDB database connection established successfolly')
}
    
    )

async function connecBD(mongo, port, host, dbName) {
     const uri = `${mongo}://${host}:${port}/${dbName}`
    // const uri = config.db.host
    //const uri = 'mongodb+srv://jgurbina:9vKOnvzgpIAxGOFX@cluster0-dc0qg.mongodb.net/tucartaqr'
    await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
}
const mongo = config.db.mongo;
const port = config.db.port;
const host = config.db.host;
const dbName = config.db.dbName;

connecBD(mongo, port, host, dbName)

module.exports = connecBD;