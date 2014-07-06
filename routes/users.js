var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Product = mongoose.model('Product');

router.get('/:userId/orders/:orderId', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
