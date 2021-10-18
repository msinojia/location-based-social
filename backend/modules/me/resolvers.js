import "babel-polyfill";

import User from "../../models/User";
import { createMiddleware } from "../../utils/createMiddleware";
import middleware from "./middleware";

export const resolvers = {
	Query: {
		me: (_, { id }, { session }) => {
			console.log("fd", id);
			return User.findById(id);
		}
	}
};
