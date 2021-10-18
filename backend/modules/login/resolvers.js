import "babel-polyfill";
import * as bcrypt from "bcryptjs";
import User from "../../models/User";
import { invalidLogin, invalidPassword } from "./errorMessages";

export const resolvers = {
	Query: {
		bye2: () => "Bye"
	},

	Mutation: {
		login: async (_, { email, password }, { session, redis, req }) => {
			console.log("​email", email);
			const user = await User.findOne({ email: email }).select(
				"email password confirmed forgotPasswordLocked"
			);

			if (!user) {
				return [
					{
						path: "email",
						message: invalidLogin
					}
				];
			}
			if (password.length == 0) {
				return [
					{
						path: "password",
						message: invalidPassword
					}
				];
			}
			var validPassword = await bcrypt.compare(password, user.password);
			if (!validPassword) {
				return [
					{
						path: "password",
						message: invalidPassword
					}
				];
			}

			// session.userId = user.id;
			// if (req.sessionID) {
			// 	await redis.lpush(`userSids:${user.id}`, req.sessionID);
			// }
			// await session.save(function(err) {
			// 	console.log(err);
			// });
			return [
				{
					id: user.id
				}
			];
		}
	}
};
