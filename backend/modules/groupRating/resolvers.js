import "babel-polyfill";

import User from "../../models/User";
import Rating from "../../models/Rating";
export const resolvers = {
	Query: {
		fetchRatingByGroupId: async (_, { groupId }, __) => {
			var ratings = await Rating.aggregate([
				{ $match: { groupId: groupId } },
				{ $group: { _id: "$rating", count: { $sum: 1 } } }
			]);
			var answer = {};
			var total = 0;
			var temp = Array(6).fill(0);
			for (var i = 0; i < ratings.length; i++) {
				temp[parseInt(ratings[i]._id)] = ratings[i].count;
				total += ratings[i].count;
			}
			answer["ratings"] = temp;
			answer["total"] = total;
			console.log(answer);
			return answer;
		},
		fetchRatingOfMember: async (_, { groupId, memberId }, __) => {
			var rating = await Rating.findOne({
				groupId: groupId,
				memberId: memberId
			});
			if (rating) {
				return rating["rating"];
			}
			return 0;
		}
	},

	Mutation: {
		addGroupRating: async (_, { memberId, groupId, rating }, __) => {
			var ratingOfUser = await Rating.findOne({
				groupId: groupId,
				memberId: memberId
			});
			if (ratingOfUser) {
				ratingOfUser.rating = rating;
				await ratingOfUser.save();
			} else {
				var rate = new Rating();
				rate.memberId = memberId;
				rate.groupId = groupId;
				rate.rating = rating;
				await rate.save();
			}
			return null;
		}
	}
};
