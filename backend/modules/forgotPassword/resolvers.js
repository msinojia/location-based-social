import "babel-polyfill";
import * as yup from "yup";
import User from "../../models/User";
import { formatYupError } from "../../utils/formatYupError";
import { passwordNotLongEnough } from "../register/errorMessages";
import { incorrectOTP, userNotFoundError } from "./errorMessages";

const Nexmo = require("nexmo");

const schema = yup.object().shape({
	newPassword: yup
		.string()
		.min(3, passwordNotLongEnough)
		.max(255)
});

const nexmo = new Nexmo(
	{
		apiKey: "f38caf6c",
		apiSecret: "LTaHY4WlDvk0smn7"
	},
	{ debug: true }
);

export const resolvers = {
	Query: {
		bye3: () => "Bye"
	},

	Mutation: {
		checkOTP: async (_, { email, OTP }, __) => {
			const user = await User.findOne({ email: email });
			if (!user) {
				return [
					{
						path: "email",
						message: userNotFoundError
					}
				];
			}
			if (user.OTP != OTP) {
				return [
					{
						path: "otp",
						message: incorrectOTP
					}
				];
			}
			user.OTP = null;
			await user.save();
			return null;
		},

		sendForgotPasswordEmail: async (_, { email }, __) => {
			const user = await User.findOne({ email: email });
			console.log(user);
			if (!user) {
				return [
					{
						path: "email",
						message: userNotFoundError
					}
				];
			}
			// await forgotPasswordLockAccount(user.id,redis);
			// const url=await createForgotPasswordLink("",user.id,redis);
			var OTP = (Math.floor(Math.random() * 10000) + 10000)
				.toString()
				.substring(1);
			OTP = parseInt(OTP);
			user.OTP = OTP;
			await user.save();

			// sending OTP to given number
			// const from = "Nexmo";
			// const to = phone;
			// const text =
			// 	"Use " +
			// 	OTP +
			// 	" as your forgot password OTP. OTP is confidential. Flock never calls you asking for OTP. Sharing it with anyone gives them full access to your Flock account.";
			// try {
			// 	await nexmo.message.sendSms(from, to, text);
			// } catch (error) {
			// 	console.log(error);
			// }
			console.log(OTP);
			// await sendEmail("hmodi2457@gmail.com", OTP);
			return null;
		},

		forgotPasswordChange: async (_, { newPassword, email }, __) => {
			try {
				await schema.validate({ newPassword }, { abortEarly: false });
			} catch (err) {
				return formatYupError(err);
			}

			const user = await User.findOne({ email: email }).select(
				"password"
			);
			if (!user) {
				return [
					{
						path: "email",
						message: userNotFoundError
					}
				];
			}
			user.password = newPassword;
			await user.save();

			return null;
		}
	}
};
