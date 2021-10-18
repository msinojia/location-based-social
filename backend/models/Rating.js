var mongoose = require("mongoose");
var Schema = mongoose.Schema;
import "babel-polyfill";

var RatingSchema = new Schema({
	memberId: { type: String, required: true },
	groupId: { type: String, required: true },
	rating: { type: Number, required: true }
});

module.exports = mongoose.model("Rating", RatingSchema);
