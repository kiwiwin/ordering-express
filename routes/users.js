var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var _ = require('underscore');

var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Product = mongoose.model('Product');

var orderUri = function (userId, orderId) {
	return "/users/" + userId + "/orders/" + orderId
}

var paymentUri = function (userId, orderId) {
	return orderUri(userId, orderId) + "/payment"
}

var mapOrderToResponse = function (order) {
	return {id: order.id, price: order.product.price, uri: orderUri(order.user.id, order.id)}
}

var mapPaymentToResponse = function (userId, orderId, payment) {
	return _.extend(payment.toObject(), {uri: paymentUri(userId, orderId)})
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

router.get('/:userId/orders/:orderId/payment', function (req, res) {
	return Order.findOne({_id: req.params.orderId, user: req.params.userId})
				.exec(function (err, order) {
					if (!_.isEmpty(order.payment.toObject())) {
						return res.send(200, mapPaymentToResponse(order.user, order.id, order.payment))
					} else {
						return res.send(404)
					}
				});
});

router.post('/:userId/orders/:orderId/payment', function (req, res) {
	var payment = {type: req.param('type'), timestamp: req.param('timestamp')}

	return Order.findOne({_id: req.params.orderId, user: req.params.userId})
				.exec(function (err, order) {
					order.pay(payment);

					res.header('location', paymentUri(order.user, order.id))
					return res.send(201);
				})
});


router.get('/:userId/orders', function (req, res) {
	return Order.find({user: req.params.userId})
				.populate('product')
				.populate('user')
				.exec(function (err, orders) {
					return res.send(200, _.map(orders, function (order) {
								return mapOrderToResponse(order);
							}));
				});
});

router.post('/:userId/orders', function (req, res) {
	var order = new Order({product: req.param('product_id')})

	return User.findById(req.params.userId, function (err, user) {
		user.placeOrder(order)

		res.header('location', orderUri(user.id, order.id))
		return res.send(201)
	});
})

module.exports = router;
