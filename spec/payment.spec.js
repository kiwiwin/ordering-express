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
		var order_without_pay;

		beforeEach(function (done) {
	        mockgoose.reset();
	        product = new Product({name: 'apple juice', description: 'good', price: 10.12});
	        product.save();

	        order = new Order({product: product._id});
	        order.save();

	        order_without_pay = new Order({product: product._id});
	        order_without_pay.save();

			user = new User({name: "kiwi"})
			user.save();
			user.placeOrder(order, done);
			user.placeOrder(order_without_pay, done);

			order.pay({type: 'cash', timestamp: new Date(2014,1,1)})
		});

		afterEach(function (done) {
			mockgoose.reset();
			done();
		});

		it('exist pay', function (done) {
			request(app)
				.get("/users/" + user.id + "/orders/" + order.id + "/payment")
				.expect(200)
				.end(function (err, res) {
					expect(res.body.type).toBe('cash')

					done();
				});
		});

		it('not exist pay', function (done) {
			request(app)
				.get("/users/" + user.id + "/orders/" + order_without_pay.id + "/payment")
				.expect(404, done);
		})
	});
})