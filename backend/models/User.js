var mongoose = require("mongoose");
var Schema = mongoose.Schema;
import "babel-polyfill";
import * as bcrypt from "bcryptjs";

var UserSchema = new Schema({
	email: { type: String, lowercase: true, default: null, unique: true },
	password: { type: String, default: null },
	confirmed: { type: Boolean, default: true },
	phone: { type: String, required: true, unique: true },
	forgotPasswordLocked: { type: Boolean, default: false },
	twitterId: { type: String, default: null },
	image: { type: String, default: null },
	username: { type: String, default: null },
	OTP: { type: Number, default: null },
	location: {
		type: { type: String },
		coordinates: [Number]
	},
	range: { type: Number, default: 100.0 }
});

UserSchema.pre("save", async function(next) {
	// var user=this;
	if (this.password) {
		if (!this.isModified("password")) {
			return next();
		}
		this.password = await bcrypt.hash(this.password, 10);
		next();
	}
});

// UserSchema.index({ point: "2dsphere" });
// UserSchema.dropIndex("point2dsphere");
module.exports = mongoose.model("User", UserSchema);
