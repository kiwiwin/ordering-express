var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Product = new Schema({
    name: {type: String},
    description: {type: String},
    price: {type: Number}
}); 

module.exports = mongoose.model("Product", Product);