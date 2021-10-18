import "babel-polyfill";
import GroupAdmin from "../../models/Admin";
import Group from "../../models/Group";
import GroupMember from "../../models/GroupMember";
import User from "../../models/User";

export const resolvers = {
	Query: {
		groupDetail: async (_, { groupId }, __) => {
			return await Group.findById(groupId);
		},

		adminList: async (_, { groupId }, __) => {
			var admins = await GroupAdmin.find({ groupId: groupId });
			var adminIds = admins.map(function(admin) {
				return admin.memberId;
			});
			return adminIds;
		},

		fetchGroup: async (_, { id, long, lat }, __) => {
			var joinedGroups = await GroupMember.find(
				{ memberId: id },
				{ groupId: 1, _id: 0 }
			);

			var groupIds = joinedGroups.map(function(group) {
				return group.groupId;
			});
			var user = await User.findById(id);
			return await Group.find({
				location: {
					$near: {
						$geometry: { type: "Point", coordinates: [long, lat] },
						$maxDistance: user.range * 1000.0
					}
				},
				_id: { $in: groupIds }
			});
		},

		fetchGroupToJoin: async (_, { id, long, lat }, __) => {
			var joinedGroups = await GroupMember.find(
				{ memberId: id },
				{ groupId: 1, _id: 0 }
			);

			var groupIds = joinedGroups.map(function(group) {
				return group.groupId;
			});
			var user = await User.findById(id);
			return await Group.find({
				location: {
					$near: {
						$geometry: {
							type: "Point",
							coordinates: [long, lat]
						},
						$maxDistance: user.range * 1000.0
					}
				},
				_id: { $nin: groupIds }
			});
		},

		addGroupList: async (_, { groupId }, __) => {
			var joinedPeople = await GroupMember.find({
				groupId: groupId
			}).select("memberId");
			var InGroup = joinedPeople.map(function(people) {
				return people.memberId;
			});
			var { location } = await Group.findById(groupId).select("location");
			var long = location.coordinates[0];
			var lat = location.coordinates[1];
			return await User.find({
				location: {
					$near: {
						$geometry: { type: "Point", coordinates: [long, lat] },
						$maxDistance: 100000.0
					}
				},
				_id: { $nin: InGroup }
			});
		},

		fetchGroupMember: async (_, { groupId }, { userLoader }) => {
			var groupMember = await GroupMember.find({ groupId: groupId });
			var groupMemberIds = groupMember.map(function(member) {
				return member.memberId;
			});
			return User.find({ _id: { $in: groupMemberIds } });
		}
	},

	Mutation: {
		makeAdmin: async (_, { groupId, memberId }, __) => {
			var exist = GroupMember.findOne({
				groupId: groupId,
				memberId: memberId
			});
			if (exist) {
				var admin = new GroupAdmin();
				admin.memberId = memberId;
				admin.groupId = groupId;
				await admin.save();
			}
			return null;
		},

		dismissAsAdmin: async (_, { groupId, memberId }, __) => {
			await GroupAdmin.findOneAndRemove({
				memberId: memberId,
				groupId: groupId
			});
			return null;
		},

		remove: async (_, { groupId, memberId }, __) => {
			await GroupAdmin.findOneAndRemove({
				memberId: memberId,
				groupId: groupId
			});
			await GroupMember.findOneAndRemove({
				memberId: memberId,
				groupId: groupId
			});
			const admins = await GroupAdmin.find({ groupId: groupId });
			if (admins.length == 0) {
				var members = await GroupMember.find({ groupId: groupId }).sort(
					{ _id: -1 }
				);
				if (members.length != 0) {
					var admin = new GroupAdmin();
					admin.groupId = groupId;
					admin.memberId = members[0].memberId;
					await admin.save();
				}
			}
			return null;
		},

		updateGroup: async (_, { groupId, description, imageLink }, __) => {
			console.log(imageLink);
			var group = await Group.findById(groupId);
			if (description) group.description = description;
			if (imageLink) group.iconLink = imageLink;
			await group.save();
			return null;
		},

		addToGroup: async (_, { members, groupId }, __) => {
			console.log("arriving ", groupId);
			var memberlist = [];
			for (var i = 0; i < members.length; i++) {
				memberlist.push({
					memberId: members[i],
					groupId: groupId
				});
			}
			await GroupMember.collection.insertMany(memberlist);
			return null;
		},

		createGroup: async (
			_,
			{ name, iconLink, creator, members, long, lat },
			__
		) => {
			var group = new Group();
			group.name = name;
			group.creator = creator;
			group.location = {
				type: "Point",
				coordinates: [long, lat]
			};
			if (iconLink) {
				group.iconLink = iconLink;
			}
			await group.save();
			var promises = [];
			promises.push(group.save());
			// adding members of the group
			members.push(creator);
			var groupMember = new GroupMember();
			var memberlist = [];
			for (var i = 0; i < members.length; i++) {
				memberlist.push({
					memberId: members[i],
					groupId: group._id.toString()
				});
			}
			promises.push(GroupMember.collection.insertMany(memberlist));
			// adding admin to the group
			var admin = new GroupAdmin();
			admin.groupId = group._id;
			admin.memberId = creator;
			promises.push(admin.save());
			await Promise.all(promises);
			return null;
		}
	}
};
