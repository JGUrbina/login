require('dotenv').config;
const Product = require('../models/product.model');
const User = require('../models/user.model');
const fs = require('fs')
const path = require('path')
const config = require('../config')
const { port, host } = config.app


const jwt = require('jsonwebtoken');


module.exports = {
    all: function(req, res){
        Product.find()
        .then(product => res.status(200).json(product))
        .catch(err => res.status(404).json('Error' + err));
    },
    viewPerUser: async function(req, res){

        const nameBusiness = req.params.nameBusiness;

        let user;
        if(!nameBusiness) res.send('Debes introducir un restaurante válido');
        try{
            user = await User.findOne({ nameBusiness })
        }catch {
            res.send('El usuario no existe');
        };
        console.log('id', user.products);
        !user ? res.send('No se ha encontrado el restaurante') : null;
        
        try{
            const products = await Product.find({ _id: user.products });
            products.length > 0 ? res.send(products) : res.status(404).send('No se han encontrado productos');
        }
        catch{
            res.send('Ha ocurrido un error');
        };
    },
    viewOne: function(req, res){
        Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(404).json('Error' + err));
    },
    destroy: function(req, res){
        const { idUser, idProduct } = req.params;

        Product.findByIdAndDelete(idProduct)
            .then(producto => {
                if(!producto) return res.status(404).send('No existe el producto');
                User.findById(idUser)
                    .then(user => {
                        const nuevosProductos = user.products.filter(producto => producto != idProduct);
                        user.products = nuevosProductos,
                        user.save()
                            .then(() => res.status(200).json('Se eliminó el producto del usuario'))
                            .catch(err => res.status(403).json('No se pudo actualizar los productos del usuario'))
                    })
                    .catch(err => res.status(404).json('Error', err))
            })
            .catch(err => res.status(404).json('Error' + err));
    },
    edit: function(req, res){
    
        Product.findById(req.params.id)
        .then(product => {
            product.name = req.body.name;
            product.descriptionShort = req.body.descriptionShort;
            product.descriptionLong = req.body.descriptionLong;
            product.purchasePrice = req.body.purchasePrice;
            product.salePrice = req.body.salePrice;
            product.categories = req.body.categories;

            if(req.file) product.img = `http://${host}:${port}/public/${req.file.filename}`;

            product.save()
                .then(() => res.status(200).send({ message: 'Se ha actualizado el producto exitosamente' }))
                .catch(err => res.status(400).json({ Error: 'No se pudo actualizar el platillo' }));
        })
        .catch(err => console.log('err', err));
    },
    editImg: function(req, res) {
        const idProduct = req.params.idProduct
        if(!idProduct) return res.status(400).send({Error: 'Debes indicar el ID del producto al cual deseas editar la  imagen'})
        Product.findById(idProduct)
        .then(async product => {
            const imgLink = product.img
            const img = imgLink.split('/')[4]
            const rutaImg = path.join(__dirname, `../storage/images/${img}`)
            const imgName = req.file.filename
            const newImg = `http://${host}:${port}/public/${imgName}`
           
            
                fs.stat(rutaImg, (err) => {
                        if(err) return res.status(404).send({Error: 'Archivo no encontrado'})
                        fs.unlink(rutaImg, async (error) => {
                            if(error) return  res.send({Error:'No se ha podido eliminar el archivo', error})
                            
                               product.img = newImg;

                               product.save()
                                .then(() =>  res.status(200).send({message: 'Imagen editada'}))
                                .catch(err => res.send({Error: 'No se pudo guardar la url de la imagen'}))
                           
                        })
                })     

        })
        
        
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
                res.send({Error: 'Intentas agregar un producto con un usuario que no existe'})
            }

            const {name, descriptionShort, descriptionLong, purchasePrice, salePrice, categories } = req.body
            const imgName = req.file.filename
            
            const img = `http://${host}:${port}/public/${imgName}`

            const newProduct = new Product({name, descriptionShort, descriptionLong, purchasePrice, salePrice,categories, img });

            try{
                const user = await User.findById(idUser);
                console.log(user + '------------------------------')

                let ProductDB = await Product.findOne({
                    $or: [
                        { name }
                    ]
                })
                if (ProductDB) {
                    if (name == ProductDB.name) {
                        return res.send({ Error: 'El platillo ya existe, intenta con otro nombre de platillo' })
                    }

                }
                user.products.push(newProduct);

                user.save()
                    .then(() => {
                        console.log('Producto agregado al usuario')
                    })
                    .catch(err => res.status(404).send({ Error: err }));
                

                newProduct.save()
                    .then(() => {
                        res.status(200).send({ message: 'Producto agregado correctamente' })
                    })
                    .catch(err => res.status(404).json('Error' + err));
            }
            catch(err){
                res.send({Error: 'Intentas agregar un producto con un usuario que no existe'})
            }         
    },
    changeStatus: function(req, res){
        const id = req.params.idProduct;
        Product.findOne({ _id: id })
            .then(product => {
                product.status = !product.status;
                product.save()
                    .then(() => {
                        res.json('Producto modificado exitosamente');
                    })
                    .catch(err => {
                        res.send('No se pudo cambiar el status del producto')
                    })
            })
            .catch(err => res.status(404).json('Error' + err));
    }
};