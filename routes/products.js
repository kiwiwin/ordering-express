var express = require('express');
var router = express.Router();
var Product = require('../models/product')

router.get('/:id', function (req, res) {
	return Product.findById(req.params.id, function(err, product) {
		if (err || product == null) {
			return res.send(404)
		}
		console.log(product)
		return res.send(200, product)
	});
});

module.exports = router;
