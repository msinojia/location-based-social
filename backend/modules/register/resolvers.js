import "babel-polyfill";
import * as yup from "yup";
import User from "../../models/User";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
import { formatYupError } from "../../utils/formatYupError";
import {
	duplicateEmail,
	duplicateUsername,
	emailNotLongEnough,
	invalidEmail,
	passwordNotLongEnough,
	phoneNotLongEnough,
	usernameNotLongEnough
} from "./errorMessages";

const schema = yup.object().shape({
	email: yup
		.string()
		.min(3, emailNotLongEnough)
		.max(255)
		.email(invalidEmail),
	password: yup
		.string()
		.min(3, passwordNotLongEnough)
		.max(255)
});

export const resolvers = {
	Query: {
		bye: () => "Bye"
	},

	Mutation: {
		register: async (_, args, { redis, url }) => {
			try {
				await schema.validate(args, { abortEarly: false });
			} catch (err) {
				return formatYupError(err);
			}

			var { email, password, phone, long, lat, username } = args;
			console.log("​email", email);
			if (phone == "") {
				return [
					{
						path: "phone",
						message: phoneNotLongEnough
					}
				];
			}
			if (username == "") {
				return [
					{
						path: "username",
						message: usernameNotLongEnough
					}
				];
			}
			const UserAlreadyExists = await User.findOne({ email: email });
			if (UserAlreadyExists) {
				return [
					{
						path: "email",
						message: duplicateEmail
					}
				];
			}

			const UsernameAlreadyExists = await User.findOne({
				username: username
			});
			if (UsernameAlreadyExists) {
				return [
					{
						path: "username",
						message: duplicateUsername
					}
				];
			}

			// const hashedPassword = await bcrypt.hash(password,10);
			if (phone.length == 10) {
				phone = "91" + phone;
			}
			var user = new User();
			user.email = email;
			user.password = password;
			user.phone = phone;
			user.username = username;
			user.location = {
				type: "Point",
				coordinates: [0, 0]
			};
			await user.save();
			const link = await createConfirmEmailLink(url, user._id, redis);
			if (process.env.NODE_ENV !== "test") {
				// await sendEmail(email, link);
			}
			return [
				{
					id: user.id
				}
			];
		}
	}
};
