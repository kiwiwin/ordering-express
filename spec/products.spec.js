var request = require('supertest');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);
var app = require("../app");

var Product = mongoose.model('Product');

describe("Product", function () {
    describe("GET", function() {
        var product;

        beforeEach(function (done) {
            mockgoose.reset();
            product = new Product({name: 'apple juice', description: 'good', price: 10.12});
            product.save(done);
        });

        it('existing product', function (done) {
            request(app)
                .get('/products/' + product.id)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.name).toBe('apple juice')
                    expect(res.body.description).toBe('good')
                    expect(res.body.price).toBe(10.12)
                    expect(res.body.uri).toContain("/products/" + product.id)
                    done();
                });
        });

        it('non-existing product', function (done) {
            request(app)
                .get('/products/not_exist_product_id')
                .expect(404, done);
        });

        it('all products', function (done) {
            request(app)
                .get('/products')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.length).toBe(1)
                    var responseProduct = res.body[0]
                    expect(responseProduct.name).toBe('apple juice')
                    expect(responseProduct.description).toBe('good')
                    done();
                });
        })

        afterEach(function (done) {
            mockgoose.reset();
            done();
        });
    });

    describe('POST', function() {
        var location;

        beforeEach(function (done) {
            mockgoose.reset();

            request(app)
            .post('/products')
            .send({name: 'new juice', description: 'new taste', price: 3.45})
            .expect(201)
            .end(function (err, res) {
                location = res.header.location
                done();
            });
        });

        it('create new product', function (done) {
            request(app)
            .get(location)
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).toBe('new juice')
                expect(res.body.description).toBe('new taste')

                done();
            })
        });

        afterEach(function (done) {
            mockgoose.reset();
            done();
        });
    })
});