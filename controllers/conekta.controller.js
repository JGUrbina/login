require('dotenv').config
var conekta = require('conekta');
const config = require('../config');
const { subscribe } = require('../routers/conekta.router');
const { conekta_key } = config.conekta;

//console.log("private", conekta_key);



module.exports = {
  create: function(req, res){
    console.log("entro a crate")
    console.log("body", req.body)
    const { currency, type, nameItem, unit_price, quantity, name, phone, email, token_id } = req.body;
    const payload = {
      currency,
      customer_info: { name, phone, email },
      line_items: [{ name: nameItem, unit_price, quantity }],
      charges: [{ payment_method: { type, token_id }}]
    }

    conekta.api_key = conekta_key;
    conekta.api_version = '2.0.0';
    conekta.locale = 'es';

    conekta.Order.create(payload)
    .then(function (res1) {
      console.log(res1.toObject())
      res.send(res1.toObject())
    },function(err) {
      err.details.forEach(function(detail, index) {
        console.log(detail);
        res.status(400).send(detail)
      }) 
    }) 

  },

  plan: function(req, res){

    const { type, name, phone, email, token_id, nameItem } = req.body;    
    const cliente = {
      name,
      email,
      phone,
      payment_sources: [{token_id, type}]
    }

    conekta.api_key = conekta_key;
    conekta.api_version = '2.0.0';
    conekta.locale = 'es'; 

    conekta.Customer.create(cliente) 
    .then(function (cliente) {
      customer = conekta.Customer.find(cliente._id)
      .then(function (customer) { 
        customer.createSubscription({plan: nameItem})
        .then(function(plan) {
          console.log("res", plan)
          res.send(plan)
        })
      })
      //.catch(error => res.status(400).json({Error: 'No se encontro el usuario'}))
    })
    //.catch(error => res.status(400).json({ Error: 'No se pudo crear el usuario' }))
  }
}