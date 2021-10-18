var mongoose = require("mongoose");
var Schema = mongoose.Schema;
import "babel-polyfill";

var GroupAdminSchema = new Schema({
	memberId: { type: String, required: true },
	groupId: { type: String, required: true }
});

module.exports = mongoose.model("GroupAdmin", GroupAdminSchema);
