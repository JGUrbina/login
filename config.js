require('dotenv').config();

config = {
    app: {
        port: process.env.PORT,
        host: process.env.HOST,
        secret_token: process.env.SECRET_TOKEN,
        mail: process.env.EMAIL,
        mailPass: process.env.MAIL_PASS

    }, 
    db: {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        mongo: process.env.MONGO
    },
    front: {
        host: process.env.FRONT_HOST
    },
    conekta: {
        conekta_key: process.env.CONEKTA_KEY
    },
}

module.exports = config