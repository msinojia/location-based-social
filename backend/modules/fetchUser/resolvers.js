import "babel-polyfill";

import User from "../../models/User";
import GroupMember from "../../models/GroupMember";
import { range } from "./constants";

export const resolvers = {
	Mutation: {
		setRange: async (_, { id, range }, __) => {
			var user = await User.findById(id);
			if (user) {
				user.range = range;
				await user.save();
				return true;
			} else {
				return false;
			}
		}
	},

	Query: {
		getRange: async (_, { id }, __) => {
			var user = await User.findById(id);
			return user.range;
		},

		allUser: async (_, { id, long, lat }, {}) => {
			var user = await User.findById(id);
			user.location = user.location = {
				type: "Point",
				coordinates: [long, lat]
			};
			await user.save();
			return await User.find({
				location: {
					$near: {
						$geometry: { type: "Point", coordinates: [long, lat] },
						$maxDistance: user.range * 1000.0
					}
				},
				_id: { $ne: id }
			});
			// return await User.find({});
		},

		singleUserDetail: async (_, { visitorId, id }, __) => {
			var user = await User.findById(id);
			console.log(user);
			return user;
		}
	}
};
