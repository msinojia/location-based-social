import "babel-polyfill";
import mongoose from "mongoose";
import Event from "../../models/Event";
import EventParticipant from "../../models/EventParticipant";
import User from "../../models/User";

const ObjectId = mongoose.Types.ObjectId;

export const resolvers = {
	Query: {
		pastEvents: async (_, { id }, __) => {
			console.log(id);
			var participants = await EventParticipant.find({
				userId: id,
				liked: 1
			});
			var ids = participants.map(function(participant) {
				return participant.eventId;
			});
			const current = new ObjectId();
			console.log(
				await Event.find({
					$and: [
						{ mongodate: { $lte: current } },
						{
							_id: { $in: ids }
						}
					]
				})
			);
			return await Event.find({
				$and: [
					{ mongodate: { $lte: current } },
					{
						_id: { $in: ids }
					}
				]
			});
		},
		futureEvents: async (_, { id }, __) => {
			var participants = await EventParticipant.find({
				userId: id,
				liked: 1
			});
			var ids = participants.map(function(participant) {
				return participant.eventId;
			});
			const current = new ObjectId();
			return await Event.find({
				$and: [
					{ mongodate: { $gte: current } },
					{
						_id: { $in: ids }
					}
				]
			}).sort([["mongodate", 1]]);
		},
		getDescription: async (_, { id }, __) => {
			var participants = await EventParticipant.find({
				eventId: id,
				liked: 1
			});
			var ids = participants.map(function(participant) {
				return participant.userId;
			});
			var users = await User.find({ _id: { $in: ids } });
			var details = await Event.findById(id);
			details.participants = users;
			return details;
		},
		fetchEventsToJoin: async (_, { id, long, lat }, __) => {
			const user = await User.findById(id);
			const current = new ObjectId();
			var joinedEvents = await EventParticipant.find({ userId: id });

			var eventIds = joinedEvents.map(function(event) {
				return event.eventId;
			});
			return await Event.find({
				$and: [
					{ mongodate: { $gte: current } },
					{
						location: {
							$near: {
								$geometry: {
									type: "Point",
									coordinates: [long, lat] //long lat
								},
								$maxDistance: user.range * 1000.0
							}
						}
					},
					{
						_id: { $nin: eventIds }
					}
				]
			});
		}
	},

	Mutation: {
		likeOrDislike: async (_, { eventId, userId, like }, __) => {
			var event = new EventParticipant();
			event.eventId = eventId;
			event.userId = userId;
			event.liked = like;
			await event.save();
			return null;
		},
		createEvent: async (
			_,
			{ id, name, imageLink, description, date, time, long, lat },
			__
		) => {
			const year = date.substring(0, 4);
			const month = date.substring(5, 7);
			const date1 = date.substring(8, 10);
			console.log(month);
			var timestamp = Math.floor(
				new Date(
					parseInt(year),
					parseInt(month) - 1,
					parseInt(date1) + 1
				).getTime() / 1000
			); //year,month,date
			var hex = ("00000000" + timestamp.toString(16)).substr(-8);
			console.log(new ObjectId().toString().substring(8));
			var objectId = new ObjectId(
				hex + new ObjectId().toString().substring(8)
			);
			console.log;
			var event = new Event();
			event.name = name;
			event.creator = id;
			event.description = description;
			event.date = date;
			event.mongodate = objectId;
			event.time = time;
			event.location = {
				type: "Point",
				coordinates: [long, lat]
			};
			event.imageLink = imageLink;
			await event.save();
			return null;
		}
	}
};
