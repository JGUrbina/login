require('dotenv').config
const  User = require('../models/user.model')


const jwt = require('jsonwebtoken')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { sendEmail } = require('../services') 
const config = require('../config')
const fs = require('fs')
const path = require('path')
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
    register: async function(req, res){
        console.log(req.body)
            const { name, lastName, motherLastName, email, nameBusiness, password } = req.body;
            // async..await is not allowed in global scope, must use a wrapper
            let Req = req.body
            payLoad = {
                name: req.body.name,
                lastName,
                email: req.body.email
            }
            
            const newUser = new User({ email, name, lastName, motherLastName, nameBusiness, password });
                               
            let userDB = await User.findOne({ $or: [
                { email }
            ]})

          if (userDB) {
             if (email == userDB.email) {
                return res.send({ message: 'El correo ya ha sido registrado' })
              }

          }

           
            newUser.save()
                .then(() => {
                    res.send({ message: 'Se ha registrado el usuario' })
                })
                .catch(err => res.status(404).json('Error' + err));
    },
    login: function(req, res) {
        let email = req.body.email
        let password = req.body.password
        User.findOne({ email })
            .then(user => {
                if(!user) return res.status(200).send({message: 'Usuario no encontrado'})
                bcrypt.compare(password, user.password)
                    .then(match => {
                        if(!match) return res.status(200).send({message: 'Contraseña incorrecta'})

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
                payLoad = {
                    name: user.name,
                    nameBusiness: user.nameBusiness,
                    email: user.email
                };

                let verify = jwt.sign(payLoad, config.app.secret_token, { expiresIn: '3h' });
                console.log('Token: ', verify)
        
                const html = `<a href="${config.front.host}/login/contraseña?${verify}">Reset account</a>`;
                sendEmail(user, res, html)
                res.status(200).send('solicitud de cambio de contraseña enviado, revise su email ')
            })
            .catch(err => res.status(404).json('Error' + err));
        
    },
    passReset: function(req, res) {
        let token = req.params.token;
        jwt.verify(token, config.app.secret_token , (err, decode) => {
            if(err) {
                return res.status(403).send({ 
                    message: 'no tienes los permisos suficientes para estar aqui', 
                    error: err 
                });
            };
            
            let email = decode.email;
            let userName = decode.userName;
            let password = req.body.password;
        
            // res.status(200).send({email: decode.email, names: decode.name, userName: decode.userName, phones: decode.phone})
        User.findOne({email})
        .then(user => {
            if(!user) return res.status(404).send({message: 'Usuario no encontrado'})
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
    },
    updateGeneralData: function(req, res) {
        const { idUser } = req.params;
        const { 
            comercialName,
            businessDescription,
            whatsNumber,
            webUrl,
            instaUrl,
            fbUrl,
            twitterUrl,
            delivery,
            localconsume,
            takeOrder,
            ratingEmail
        } = req.body;



        if(!idUser){
            return res.status(404).send({ error: 'Debes pasar el id del usuario para registrar los datos generales'})
        }else {
            User.findById(idUser)
                .then(user => {
                    const whataccepts = { delivery, localconsume, takeOrder };

                    console.log('whataccepts', whataccepts);

                    user.comercialName = comercialName;
                    user.businessDescription = businessDescription;
                    user.whatsNumber = whatsNumber;
                    user.webUrl = webUrl;
                    user.instaUrl = instaUrl;
                    user.fbUrl = fbUrl;
                    user.twitterUrl = twitterUrl;
                    user.whataccepts = whataccepts;
                    user.ratingEmail = ratingEmail;

                    if(req.files && req.files.length > 0){
                        const handleImage = (newImage, oldImage) => {
                            if(oldImage && oldImage.length > 0 && oldImage != "undefined"){
                                const imgLink = oldImage;
                                const img = imgLink.split('/')[4];
                                const rutaImg = path.join(__dirname, `../storage/images/${img}`);
                                console.log('rutaimg', rutaImg);
                                fs.stat(rutaImg, (err) => {
                                    if(err) return res.status(404).send({Error: 'Archivo no encontrado'});
                                    fs.unlink(rutaImg, async (error) => {
                                        if(error) return  res.send({Error:'No se ha podido eliminar el archivo', error});
                                    });
                                });
                            };
                            const urlImg = `http://${config.app.host}:${config.app.port}/public/${newImage.filename}`;
                            return urlImg;
                        };

                        req.files.forEach(file => {
                            switch(file.fieldname){
                                case 'logo':
                                    user.logo = handleImage(file, user.logo);
                                    break;
                                case 'coverImg':
                                    user.coverImg = handleImage(file, user.coverImg);
                                    break;
                                case 'promotionalImg':
                                    user.promotionalImg = handleImage(file, user.promotionalImg);
                                    break;
                                default: 
                                    console.log('ninguno');
                                    break;
                            };
                        });
                    };


                    user.save()
                        .then(() => res.status(200).send({ message: 'Los datos generales han sido actualizados'}))
                        .catch(err => console.log('err', err));
            });
        };

    },
    generalData: function(req, res) {
        const nameBusiness = req.params.nameBusiness;

        User.findOne({ nameBusiness })
            .then(user => {
                const data = {
                logo: user.logo,
                coverImg: user.coverImg,
                comercialName: user.comercialName,
                businessDescription: user.businessDescription,
                webUrl: user.webUrl,
                instaUrl: user.instaUrl,
                fbUrl: user.fbUrl,
                twitterUrl: user.twitterUrl,
                whatsNumber: user.whatsNumber,
                promotionalImg: user.promotionalImg,
                ratingEmail: user.ratingEmail,
                whataccepts: user.whataccepts
            };
                res.send(data);
            })
            .catch(err => res.status(404).json('Error' + err));
    }
};