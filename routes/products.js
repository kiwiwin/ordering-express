var express = require('express');
var _ = require('underscore')
var router = express.Router();
var mongoose = require("mongoose");
var Product = mongoose.model('Product');

var productUri = function (product) {
	return '/products/' + product.id
}

var mapProductToResponse = function (product) {
	return _.extend(product.toObject(), {uri: productUri(product)})
}

router.post('/', function (req, res) {
	var product = new Product({name: req.param('name'), description: req.param('description'), price: req.param('price')})
	product.save();
	res.header('location', productUri(product))
	res.send(201)
})

router.get('/', function (req, res) {
	return Product.find({}, function(err, products) {
		return res.send(200, _.map(products, function (product) {
			return mapProductToResponse(product)
		}));
	});
})

router.get('/:id', function (req, res) {
	return Product.findById(req.params.id, function (err, product) {
		if (err || _.isNull(product)) {
			return res.send(404)
		}
		return res.send(200, mapProductToResponse(product))
	});
});

module.exports = router;
