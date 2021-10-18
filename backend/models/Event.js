var mongoose = require("mongoose");
var Schema = mongoose.Schema;
import "babel-polyfill";

var EventSchema = new Schema({
	creator: { type: String },
	name: { type: String, required: true },
	imageLink: { type: String, required: true },
	description: { type: String, required: true },
	date: { type: String, required: true },
	mongodate: { type: String },
	time: { type: String, required: true },
	location: {
		type: { type: String },
		coordinates: [Number]
	}
});

module.exports = mongoose.model("Event", EventSchema);
