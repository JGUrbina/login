require('dotenv').config
const  User = require('../models/user.model')


const jwt = require('jsonwebtoken')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { sendEmail } = require('../services') 
const config = require('../config')
const { use } = require('../routers/user.router')

module.exports = {
    all: function(req, res){
        User.find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json('Error' + err));
    },
    viewOne: function(req, res){
        User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(404).json('Error' + err));
    },
    destroy: function(req, res){
        User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User delete!!'))
        .catch(err => res.status(404).json('Error' + err));
    },
    edit: function(req, res){
        User.findById(req.params.id)
        .then(user => {
            user.userName = req.body.name
            user.email = req.body.email
            user.name = req.body.userName
            user.phone = req.body.phone
            user.rol = req.body.rol
            user.isVerify = req.body.isVerify
            user.save()
                .then(() => res.json('User Update!'))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
    },
    confirmation: function (req, res) {
        let token = req.params.token;
        jwt.verify(token, config.app.secret_token , (err, decode) => {
            if(err) {
                return res.status(403).send({ 
                    message: 'no tienes los permisos suficientes para estar aqui', 
                    error: err 
                })
            }
            
            let email = decode.email
            let userName = decode.userName
        
            // res.status(200).send({email: decode.email, names: decode.name, userName: decode.userName, phones: decode.phone})
        User.findOne({email})
        .then(user => {
            if(!user) return res.status(404).send({message: 'user not found'})
            // res.status(200).send({email, names: decode.name, userName: decode.userName, phones: decode.phone})
            user.userName = userName
            user.email = email
            user.isVerify = true
            user.save()
                .then(() => res.send({
                    message: 'Email verificado!!!',
                    token
                }))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
            
        })
    },
    register: async function(req, res){
        console.log(req.body)
            const {name, userName, lastName, motherLastName, email, genero, nameBusiness} = req.body
            const rol = 'admin';
            const isVerify = false
            // async..await is not allowed in global scope, must use a wrapper
            let Req = req.body
            payLoad = {
                name: req.body.name,
                lastName,
                email: req.body.email,
                isVerify: false,
            }
            let verify = jwt.sign(payLoad, config.app.secret_token , { expiresIn: '3h' });
            console.log('Token: ', verify)

            const html = `<a href="${config.front.host}/login/contraseña?${verify}">verify your accuont</a>`;
            
            const newUser = new User({email, name, rol, isVerify, lastName, motherLastName, genero, nameBusiness})
                               
            let userDB = await User.findOne({ $or: [
                { email }
            ]})

          if (userDB) {
             if (email == userDB.email) {
                return res.send({ message: 'E-mail already exists' })
              }

          }

           
            newUser.save()
                .then(() => {
                    sendEmail(Req, res, html)
                    res.status(200).json('User add, hemos enviado un email para verificarlo')
                })
                .catch(err => res.status(404).json('Error' + err));
    },
    login: function(req, res) {
        let email = req.body.email
        let password = req.body.password
        User.findOne({ email })
            .then(user => {
                if(!user) return res.status(200).send({message: 'user not found'})
                bcrypt.compare(password, user.password)
                    .then(match => {
                        if(!user.isVerify) return res.status(404).send({message: 'Tienes que verificar tu email.'})
                        if(!match) return res.status(200).send({message: 'Password Incorrecta!!'})

                        // res.status.json({token: service.createToken(user)}) ;
                            payLoad = {
                                id: user._id,
                                userName: user.userName,
                                email: user.email,
                                rol: user.rol,
                                nameBusiness: user.nameBusiness
                            }
                        // poner clave secreta en una variable de entorno
                            jwt.sign(payLoad, config.app.secret_token , (err, token) => {
                                if(err) return res.status(500).json({Error : err})
                                res.status(200).json({message: 'aceso consedido', token, payLoad})
                            })
                        
                        
                    })
                    .catch(err => res.status(500).send({message: 'acá hay un erro ', err}))
            })
                
            .catch(err => res.status(500).send({err}))
    },
    sendEmailPassReset: function(req, res) {
    const  {email, nameBusiness} = req.body
        User.findOne({email})
            .then(user => {
                // res.status(200).send({message: user})
                if(user.nameBusiness != nameBusiness || user.email != email) return res.json('Los datos enviados no son compatibles')
                if(!user.isVerify) return res.status(200).send({message: 'Antes de cambiar tu contraseña tienes que verificar tu email.'})
                payLoad = {
                    name: user.name,
                    nameBusiness: user.nameBusiness,
                    email: user.email
                }
                let verify = jwt.sign(payLoad, config.app.secret_token, { expiresIn: '3h' });
                console.log('Token: ', verify)
        
                const html = `<a href="${config.front.host}/login/contraseña?${verify}">Reset account</a>`;
                sendEmail(user, res, html)
                res.status(200).send('solicitud de cambio de contraseña enviado, revise su email ')
            })
            .catch(err => res.status(404).json('Error' + err))
        
    },
    passReset: function(req, res) {
        let token = req.params.token;
        jwt.verify(token, config.app.secret_token , (err, decode) => {
            if(err) {
                return res.status(403).send({ 
                    message: 'no tienes los permisos suficientes para estar aqui', 
                    error: err 
                })
            }
            
            let email = decode.email
            let userName = decode.userName
            let password = req.body.password
        
            // res.status(200).send({email: decode.email, names: decode.name, userName: decode.userName, phones: decode.phone})
        User.findOne({email})
        .then(user => {
            if(!user) return res.status(404).send({message: 'user not found'})
            // res.status(200).send({email, names: decode.name, userName: decode.userName, phones: decode.phone})
            user.userName = userName
            user.email = email
            user.password = password
            user.save()
                .then(() => res.json('Password Reset!!!'))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
            
        })
    }
};