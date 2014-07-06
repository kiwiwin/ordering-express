var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Order = new Schema({
	product : {type: Schema.Types.ObjectId, ref: 'Product'},
	user : {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model("Order", Order);