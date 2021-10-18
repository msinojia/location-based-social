var mongoose = require("mongoose");
var Schema = mongoose.Schema;
import "babel-polyfill";

var GroupSchema = new Schema({
	name: { type: String, required: true },
	iconLink: { type: String, default: null },
	creator: { type: String, required: true },
	description: { type: String, default: null },
	location: {
		type: { type: String },
		coordinates: [Number]
	}
});

module.exports = mongoose.model("Group", GroupSchema);
