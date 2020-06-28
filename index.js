const {port, host} = require('./config').app
const express = require('express');
const app = express();
const connecBD = require('./db')
const morgan = require('morgan');
const cors = require('cors');
// const mongoose = require('mongoose');
//connect to data base
async function initApp() {
    try {
        connecBD()

        //Listening
        app.listen(port, () => console.log(`server on ${host}`) );
    }catch(err) {
        console.error(err)
        process.exit(0)
    }
}
 
initApp()

app.use('/public',express.static(__dirname + '/storage/images'))

//Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
//Routes

//users
const userRouters = require('./routers/user.router')
const productRouters = require('./routers/product.router')

app.use('/user', userRouters)
app.use('/product', productRouters)
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/login/index.html');
})