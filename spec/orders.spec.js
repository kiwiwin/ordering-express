var request = require('supertest');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);
var app = require("../app");

var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Order = mongoose.model('Order');

describe('Order', function() {
	describe('Get', function() {
		var product;
		var user;
		var order;

		beforeEach(function (done) {
	        mockgoose.reset();
	        product = new Product({name: 'apple juice', description: 'good', price: 10.12});
	        product.save();

			user = new User({name: "kiwi"})
			user.save(function (err) {
				order = new Order({
					product: product._id,
					user: user._id
				});

				order.save(done);
			});
		});

		afterEach(function (done) {
			mockgoose.reset();
			done();
		});

		it('exist order', function (done) {
			request(app)
				.get("/users/" + user.id + "/orders/" + order.id)
				.expect(200)
				.end(function (err, res) {
					expect(res.body.price).toBe(10.12);

					done();
				});
		})
	})
})