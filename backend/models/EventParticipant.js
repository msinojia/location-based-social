var mongoose = require("mongoose");
var Schema = mongoose.Schema;
import "babel-polyfill";

var EventParticipantSchema = new Schema({
	eventId: { type: String, required: true },
	userId: { type: String, required: true },
	liked: { type: Number, required: true }
});

module.exports = mongoose.model("EventParticipant", EventParticipantSchema);
