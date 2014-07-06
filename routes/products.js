var express = require('express');
var _ = require('underscore')
var router = express.Router();
var Product = require('../models/product');

var mapProductToResponse = function (product) {
	return {id: product.id, name: product.name, description: product.description,
				uri: '/products/' + product.id }
}

router.get('/', function (req, res) {
	return Product.find({}, function(err, products) {
		return res.send(200, _.map(products, function(product) {
			return mapProductToResponse(product)
		}));
	});
})

router.get('/:id', function (req, res) {
	return Product.findById(req.params.id, function(err, product) {
		if (err || product == null) {
			return res.send(404)
		}
		return res.send(200, mapProductToResponse(product))
	});
});

module.exports = router;
