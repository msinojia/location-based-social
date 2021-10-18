var mongoose = require("mongoose");
var Schema = mongoose.Schema;
import "babel-polyfill";

var MessageSchema = new Schema({
	senderId: { type: String, required: true },
	receiverId: { type: String, required: true },
	text: { type: String, required: true }
});

module.exports = mongoose.model("Message", MessageSchema);
