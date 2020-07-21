require('dotenv').config
var conekta = require('conekta');
const config = require('../config');
const { conekta_key } = config.conekta;

console.log("private", conekta_key);



module.exports = {


  create: function(req, res){
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

  }


}