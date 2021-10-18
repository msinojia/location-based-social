import DataLoader from "dataloader";
import User from "../models/User";

// type BatchUser = (ids: string[]) => Promise<User[]>;

const batchUsers = async ids => {
	var users = await User.find({ _id: { $in: ids } });
	const userMap = {};
	users.forEach(u => {
		userMap[u.id] = u;
	});

	return ids.map(id => userMap[id]);
};

export const userLoader = () => new DataLoader(batchUsers);
