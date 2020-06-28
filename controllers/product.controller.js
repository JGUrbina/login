require('dotenv').config
const  Product = require('../models/product.model');
const User = require('../models/user.model');


const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = {
    all: function(req, res){
        Product.find()
        .then(product => res.status(200).json(product))
        .catch(err => res.status(404).json('Error' + err));
    },
    viewOne: function(req, res){
        Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(404).json('Error' + err));
    },
    destroy: function(req, res){
        Product.findByIdAndDelete(req.params.id)
        .then(() => res.json('Product delete!!'))
        .catch(err => res.status(404).json('Error' + err));
    },
    edit: function(req, res){
        
        Product.findById(req.params.id)
        .then(product => {
            product.name = req.body.name
            product.descriptionShort = req.body.descriptionShort
            product.descriptionLong = req.body.descriptionLong
            product.purchasePrice = req.body.purchasePrice
            product.salePrice = req.body.salePrice

            res.send(product)
            product.save()
                .then(() => res.json('Product Update!'))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
    },
    register: async function(req, res){
            const idUser = req.params.idUser
            if(!idUser) {
                return res.send({Error: 'Debes pasar el id del usuaria que agrega el producto'}); 
            }
            try{
                const user = await User.findById(idUser)
                console.log(user + '+++++++++++++++++++++++++++++++++++++')
            }catch(err){
                res.send({Error: 'Intentas agregar un producto con un usuarioque no existe'})
            }

            const {name, descriptionShort, descriptionLong, purchasePrice, salePrice } = req.body
            const imgName = req.file.filename
            const { port, host } = config.app;
            const img = `http://${host}:${port}/public/${imgName}`

            const newProduct = new Product({name, descriptionShort, descriptionLong, purchasePrice, salePrice, img });

            try{
                const user = await User.findById(idUser);
                console.log(user + '------------------------------')

                let ProductDB = await Product.findOne({
                    $or: [
                        { name, salePrice }
                    ]
                })
                if (ProductDB) {
                    if (name == ProductDB.name && salePrice == ProductDB.salePrice) {
                        return res.send({ message: 'El platillo ya existe..!' })
                    }

                }
                user.products.push(newProduct);

                user.save()
                    .then(() => {
                        res.status(200).json('Producto agregado al usuario');
                    })
                    .catch(err => res.status(404).json('Error', + err));
                

                newProduct.save()
                    .then(() => {
                        res.status(200).json('Product add, se ha agregado el producto correctamente')
                    })
                    .catch(err => res.status(404).json('Error' + err));
            }
            catch(err){
                res.send({Error: 'Intentas agregar un producto con un usuarioque no existe'})
            }         
    }
};