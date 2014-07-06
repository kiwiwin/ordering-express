var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var User = new Schema({
    name: {type: String},
    orders: [{type: Schema.Types.ObjectId, ref: 'Order'}]
}); 

module.exports = mongoose.model("User", User);