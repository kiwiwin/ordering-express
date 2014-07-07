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

	        order = new Order({product: product._id});
	        order.save();

	        order2 = new Order({product: product._id});
	        order2.save();

			user = new User({name: "kiwi"})
			user.save();
			user.placeOrder(order, done)
			user.placeOrder(order2, done)
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
				.expect(200)
				.end(function (err, res) {
					expect(res.body.length).toBe(2);
					expect(res.body[0].id).toBe(order.id);
					expect(res.body[0].price).toBe(10.12);
					expect(res.body[0].uri).toContain("/users/" + user.id + "/orders/" + order.id)

					done();
				});
		});
	});

	describe('Post', function () {
		var location;

		beforeEach(function (done) {
	        mockgoose.reset();
	        product = new Product({name: 'apple juice', description: 'good', price: 10.12});
	        product.save();

			user = new User({name: "kiwi"})
			user.save();
			
			request(app)
				.post("/users/" + user.id + "/orders")
				.send({product_id: product.id})
				.expect(201)
				.end(function (err, res) {
                	location = res.header.location
                	done();
            	});
		});		

		it('create order', function (done) {
			request(app)
				.get(location)
				.expect(201)
				.end(function (err, res) {
					expect(res.body.price).toBe(10.12);

					done();
				});
		})
	})
})