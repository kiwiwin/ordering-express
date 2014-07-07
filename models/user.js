var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var User = new Schema({
    name: {type: String},
    orders: [{type: Schema.Types.ObjectId, ref: 'Order'}]
}); 

User.methods.placeOrder = function (order, callback) {
	var user = this;
	this.orders.push(order);
	this.save(function (err) {
		order.user = user
		order.save(callback)
	});
}

module.exports = mongoose.model("User", User);