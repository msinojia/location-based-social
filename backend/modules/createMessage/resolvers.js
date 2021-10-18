import "babel-polyfill";
import { withFilter } from "graphql-yoga";
import moment from "moment";

import User from "../../models/User";
import Message from "../../models/Message";
import { PUBSUB_NEW_MESSAGE } from "./constants";

export const resolvers = {
	Message: {
		user: async ({ senderId }, _, { userLoader }) =>
			userLoader.load(senderId),
		time: async ({ _id }, _, __) => {
			var date = moment(_id.getTimestamp());
			var dateComponent = date.utc().format("DD/MM/YYYY");
			var timeComponent = date.utc().format("HH:mm");
			return dateComponent + " " + timeComponent;
		}
	},
	Query: {
		fetchMessage: async (_, { senderId, receiverId, query }, __) => {
			if (query == 0) {
				return await Message.find({
					$or: [
						{ senderId: senderId, receiverId: receiverId },
						{ senderId: receiverId, receiverId: senderId }
					]
				}).sort({ _id: -1 });
			} else {
				return await Message.find({ receiverId: receiverId }).sort({
					_id: -1
				});
			}
		}
	},

	Subscription: {
		newMessage: {
			subscribe: withFilter(
				(_, __, { pubsub }) => pubsub.asyncIterator(PUBSUB_NEW_MESSAGE),
				(payload, variables) => {
					return (
						(payload.newMessage.senderId === variables.senderId &&
							payload.newMessage.receiverId ===
								variables.receiverId) ||
						(payload.newMessage.senderId === variables.receiverId &&
							payload.newMessage.receiverId ===
								variables.senderId)
					);
				}
			)
		}
	},

	Mutation: {
		createMessage: async (
			_,
			{ senderId, receiverId, text },
			{ pubsub }
		) => {
			var message = new Message();
			message.senderId = senderId;
			message.receiverId = receiverId;
			message.text = text;
			await message.save();
			pubsub.publish(PUBSUB_NEW_MESSAGE, {
				newMessage: message
			});
			return null;
		}
	}
};
