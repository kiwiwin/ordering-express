var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Product = mongoose.model('Product');

var orderUri = function (order) {
	return "/users/" + order.user.id + "/orders/" + order.id
}

var mapOrderToResponse = function (order) {
	return {id: order.id, price: order.product.price, uri: orderUri(order)}
}

router.get('/:userId/orders/:orderId', function (req, res) {
	return Order.findOne({_id: req.params.orderId, user: req.params.userId})
				.populate('product')
				.populate('user')
				.exec(function (err, order) {
					if (err || order == null) {
						return res.send(404)
					} else {
						return res.send(200, mapOrderToResponse(order))
					}
				});
});

module.exports = router;
