var request = require('supertest')
var app = require("../app");

describe("Product", function () {
    it('http status 200', function (done) {
        request(app)
            .get('/products/1')
            .expect(200, done);
    });

    afterEach(function(done) {
        done();
    })
});