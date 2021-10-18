import "babel-polyfill";
import * as fs from "fs";
import { importSchema } from "graphql-import";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";
import { GraphQLServer, PubSub } from "graphql-yoga";
import mongoose from "mongoose";
import * as path from "path";
import { userLoader } from "./loaders/UserLoader";

// const RedisStore = connectRedis(session);

export const startServer = async () => {
	const folders = fs.readdirSync(path.join(__dirname, "./modules"));
	const schemas = [];
	folders.forEach(folder => {
		const { resolvers } = require(`./modules/${folder}/resolvers`);
		const typeDefs = importSchema(
			path.join(__dirname, `./modules/${folder}/schema.graphql`)
		);

		schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
	});

	// const redis = new Redis();
	const pubsub = new PubSub();

	const server = new GraphQLServer({
		schema: mergeSchemas({ schemas }),
		context: ({ request }) => ({
			url: request ? request.protocol + "://" + request.get("host") : "",
			session: request ? request.session : undefined,
			req: request,
			userLoader: userLoader(),
			pubsub
		})
	});

	// server.express.use(
	// 	new RateLimit({
	// 		store: new RateLimitRedis({
	// 			client: redis
	// 		}),
	// 		windowMs: 15 * 60 * 1000,
	// 		max: 100,
	// 		delayMs: 0
	// 	})
	// );

	// server.express.use(
	// 	session({
	// 		store: new RedisStore({
	// 			client: redis,
	// 			prefix: "sess:"
	// 		}),
	// 		name: "qid",
	// 		secret: "jayswaminarayan",
	// 		resave: false,
	// 		saveUninitialized: false,
	// 		cookie: {
	// 			httpOnly: true,
	// 			secure: process.env.NODE_ENV === "production",
	// 			maxAge: 1000 * 60 * 60 * 24 * 7
	// 		}
	// 	})
	// );

	const cors = {
		credentials: true,
		origin: process.env.NODE_ENV === "test" ? "*" : "http://localhost:3000"
	};

	// server.express.get("/confirm/:id", async (req, res) => {
	// 	const { id } = req.params;
	// 	const userId = await redis.get(id);
	// 	if (userId) {
	// 		const user = await User.findById(userId);
	// 		if (!user) {
	// 			res.send("not ok");
	// 		}
	// 		user.confirmed = true;
	// 		await user.save();
	// 		await redis.del(id);
	// 		res.send("ok");
	// 	} else {
	// 		res.send("not ok");
	// 	}
	// });
	// mongodb://hardik:h97122MODI@ds117362.mlab.com:17362/sen
	// mongodb://localhost:27017/sen
	await mongoose.connect(
		"mongodb://hardik:h97122MODI@ds117362.mlab.com:17362/sen",
		{ useNewUrlParser: true },
		function(err) {
			if (err) {
				console.log(err);
				console.log("Error connecting database");
			} else {
				console.log(process.env.NODE_ENV);
				console.log("Connected successfully");
			}
		}
	);

	// passport.use(
	// 	new Strategy(
	// 		{
	// 			consumerKey: "",
	// 			consumerSecret:
	// 				"c",
	// 			callbackURL: "http://localhost:4000/auth/twitter/callback",
	// 			includeEmail: true
	// 		},
	// 		async (token, tokenSecret, profile, cb) => {
	// 			const { id, emails } = profile;
	// 			let email;
	// 			if (emails) {
	// 				email = emails[0].value;
	// 			}
	// 			let user = await User.findOne({ twitterId: id });
	// 			if (!user) {
	// 				if (email) {
	// 					user = await User.findOne({ email: email });
	// 				}
	// 				if (user) {
	// 					user.twitterId = id;
	// 					await user.save();
	// 				}
	// 				if (!user) {
	// 					user = new User();
	// 					user.twitterId = id;
	// 					if (email) {
	// 						user.email = email;
	// 					}
	// 					await user.save();
	// 				}
	// 			}
	// 			return cb(null, { id: user.id });
	// 		}
	// 	)
	// );

	// server.express.use(passport.initialize());

	// server.express.get("/auth/twitter", passport.authenticate("twitter"));

	// server.express.get(
	// 	"/auth/twitter/callback",
	// 	passport.authenticate("twitter", { session: false }),
	// 	function(req, res) {
	// 		req.session.userId = req.user.id;
	// 		res.redirect("/");
	// 	}
	// );

	// process.env.NODE_ENV === "test" ? 0 :
	const port = process.env.PORT || 4001;
	const p = port;
	const app = await server.start({
		cors,
		port: process.env.NODE_ENV === "test" ? 0 : p
	});
	console.log("Serevr running on localhost:" + p);
	return app;
};
