var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Order = new Schema({
	product : {type: Schema.Types.ObjectId, ref: 'Product'},
	user : {type: Schema.Types.ObjectId, ref: 'User'},
	payment : {
		type: {type: String},
		timestamp: {type: Date}
	}
});

Order.methods.pay = function (payment, callback) {
	this.payment = payment;
	this.save(callback);
}

module.exports = mongoose.model("Order", Order);