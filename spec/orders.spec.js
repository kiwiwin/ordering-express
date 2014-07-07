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

	        order = new Order({
	        	product: product._id
	        })
	        order.save();

			user = new User({name: "kiwi"})
			user.placeOrder(order, done)
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
					expect(res.body.id).toBe(order.id);
					expect(res.body.price).toBe(10.12);
					expect(res.body.uri).toContain("/users/" + user.id + "/orders/" + order.id)

					done();
				});
		});

		it('not exist order', function (done) {
			request(app)
				.get("/users/" + user.id + "/orders/not_exist_order_id")
				.expect(404, done)
		});

		it('all orders of a user', function (done) {
			request(app)
				.get("/users/" + user.id + "/orders")
				.expect(200, done)
		})
	})
})