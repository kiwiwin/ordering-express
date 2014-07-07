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
					expect(res.body.uri).toContain('/users/' + user.id + '/orders/' + order.id + "/payment")
					done();
				});
		});

		it('not exist pay', function (done) {
			request(app)
				.get("/users/" + user.id + "/orders/" + order_without_pay.id + "/payment")
				.expect(404, done);
		})
	});

	describe('Post', function() {
		var location;

		beforeEach(function (done) {
	        mockgoose.reset();
	        product = new Product({name: 'apple juice', description: 'good', price: 10.12});
	        product.save();

	        order = new Order({product: product._id});
	        order.save();

			user = new User({name: "kiwi"})
			user.save();
			user.placeOrder(order, done);

			request(app)
				.post("/users/" + user.id + "/orders/" + order.id + "/payment")
				.send({type: 'cash', timestamp: new Date(2014,1,1)})
				.expect(201)
				.end(function (err, res) {
                	location = res.header.location
                	done();
				})
		});

		afterEach(function (done) {
			mockgoose.reset();
			done();
		});

		it('create new payment', function (done) {
			request(app)
				.get(location)
				.expect(200)
				.end(function (err, res) {
					expect(res.body.type).toBe('cash')

					done();
				});
		});
	});
})