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
        product = new Product({name: 'apple juice', description: 'good', price: 10.12});
        product.save(done);
    });

    it('http status 200', function (done) {
        request(app)
            .get('/products/' + product.id)
            .expect(200)
            .end(function(err, res) {
                expect(res.body.name).toBe('apple juice')
                expect(res.body.description).toBe('good')
                done();
            });
    });

    it('http status 404', function (done) {
        request(app)
            .get('/products/not_exist_product_id')
            .expect(404, done);
    });

    afterEach(function (done) {
        mockgoose.reset();
        done();
    });
});