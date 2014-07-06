var request = require('supertest');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);
var app = require("../app");

var Product = mongoose.model('Product');

describe("Product", function () {
    var product;

    beforeEach(function (done) {
        mockgoose.reset();
        product = new Product({name: 'name', description: 'description', price: 10.12});
        product.save(done);
    });

    it('http status 200', function (done) {
        request(app)
            .get('/products/' + product.id)
            .expect(200, done);
    });

    afterEach(function (done) {
        mockgoose.reset();
        done();
    });
});