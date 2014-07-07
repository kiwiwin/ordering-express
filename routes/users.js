var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Product = mongoose.model('Product');

router.get('/:userId/orders/:orderId', function (req, res) {
	return Order.findOne({_id: req.params.orderId, user: req.params.userId})
				.populate('product')
				.exec(function (err, order) {
					return res.send(200, {id: order.id, price: order.product.price})
				});
});

module.exports = router;
