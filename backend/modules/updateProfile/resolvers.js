import "babel-polyfill";

import User from "../../models/User";
import { invalidLogin, errorFinding } from "../login/errorMessages";

export const resolvers = {
	Query: {
		du: () => "Bye"
	},

	Mutation: {
		updateProfile: async (_, { image, id }, __) => {
			console.log("id", id);
			const user = await User.findById(id);

			if (!user) {
				return [
					{
						path: "email",
						message: invalidLogin
					}
				];
			}
			user.image = image;
			await user.save();
			return null;
		},
		updateUsername: async (_, { username, id }, __) => {
			console.log("id", id);
			const user = await User.findById(id);

			if (!user) {
				return [
					{
						path: "email",
						message: invalidLogin
					}
				];
			}
			user.username = username;
			await user.save();
			return null;
		}
	}
};
