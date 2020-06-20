require('dotenv').config
const  Product = require('../models/product.model')


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
            product.save()
                .then(() => res.json('Product Update!'))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
    },
    register: async function(req, res){
        console.log(req.body)
            const {name, descriptionShort, descriptionLong, purchasePrice, salePrice } = req.body
            
            const newProduct = new Product({name, descriptionShort, descriptionLong, purchasePrice, salePrice })
                               
            let ProductDB = await Product.findOne({ $or: [
                { name, salePrice, descriptionShort }
            ]})

          if (ProductDB) {
             if (name == ProductDB.name && salePrice == ProductDB.name && descriptionShort == ProductDB.descriptionShort) {
                return res.send({ message: 'El platillo ya existe..!' })
              }

          }

           
            newProduct.save()
                .then(() => {
                    res.status(200).json('Product add, se ha agregado el producto correctamente')
                })
                .catch(err => res.status(404).json('Error' + err));
    }
};