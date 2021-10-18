import {request} from 'graphql-request';
import 'babel-polyfill';
import axios from 'axios';
// import mongoose from 'mongoose';
var Redis = require('ioredis');
import fetch from 'node-fetch';

import {createConfirmEmailLink} from '../../utils/createConfirmEmailLink';
import {createForgotPasswordLink} from '../../utils/createForgotPasswordLink';

import User from '../../models/User';
import {startServer} from '../../startServer';
import {TestClient} from '../../utils/testClient';

import {
	invalidLogin,
	emailNotVerified,
	invalidPassword,
	forgotPassword
} from '../login/errorMessages';
import {
	expiredKeyError
} from '../forgotPassword/errorMessages';
import {forgotPasswordLockAccount} from '../../utils/forgotPasswordLockAccount';

let getHost=()=>'';
var id="";
var id1;
let checkId="";
let forgotId="";
const redis=new Redis();
let newPassword="pwdChanged"

beforeAll(async()=>{
    jest.setTimeout(50000);
	const app=await startServer();
	const {port}=app.address();
    getHost=()=>`http://127.0.0.1:${port}`;
    const client = new TestClient(getHost());
    //const response = await client.register("tmp1@gmail.com","password", "8160981960","tmp1");
    const response1 = await client.login("tmp1@gmail.com","password");
    
    const client1 = new TestClient(getHost());
    const response11 = await client1.register("r1@gmail.com","password", "8160981960","r1");
    const response12 = await client1.login("r1@gmail.com","password");

    const client2 = new TestClient(getHost());
    const response21 = await client2.register("r2@gmail.com","password", "8160981960","r2");
    const response22 = await client2.login("r2@gmail.com","password");

    const client3 = new TestClient(getHost());
    const response31 = await client3.register("r3@gmail.com","password", "8160981960","r3");
    const response32 = await client3.login("r3@gmail.com","password");

    // const client4 = new TestClient(getHost());
    // const response41 = await client4.register("r4@gmail.com","password", "8160981960","r4");
    // const response42 = await client4.login("r4@gmail.com","password");

    // const client5 = new TestClient(getHost());
    // const response51 = await client5.register("r5@gmail.com","password", "8160981960","r5");
    // const response52 = await client5.login("r5@gmail.com","password");

    // const client6 = new TestClient(getHost());
    // const response61 = await client6.register("r6@gmail.com","password", "8160981960","r6");
    // const response62 = await client6.login("r6@gmail.com","password");

    // const client7 = new TestClient(getHost());
    // const response71 = await client7.register("r7@gmail.com","password", "8160981960","r7");
    // const response72 = await client7.login("r7@gmail.com","password");

    // const client8 = new TestClient(getHost());
    // const response81 = await client8.register("r8@gmail.com","password", "8160981960","r8");
    // const response82 = await client8.login("r8@gmail.com","password");

    // const client9 = new TestClient(getHost());
    // const response91 = await client9.register("r9@gmail.com","password", "8160981960","r9");
    // const response92 = await client9.login("r9@gmail.com","password");

    const response2 = await client.createGroup("name","abcd","5cb4fe7457c2a0196c845c88",["5cb4fe7d88e872196c88f535","5cb50877efb7ae08d89166aa"],22.22,20.22);
    id1 = response2.data.createGroup.id;
	// var user = new User();
	// user.email = "test@test.com";
	// user.password="jklamnlcndkcn";
	// await user.save();
	// userId=user._id;
	// var getCurrentUser=new User();
	// getCurrentUser.email="checking@checking.com";
	// getCurrentUser.password="checking";
	// getCurrentUser.confirmed=true;
	// getCurrentUser.save();
	// checkId=getCurrentUser.id;

	// var forgotPassword=new User();
	// forgotPassword.email="forgot@forgot.com";
	// forgotPassword.password="forgot";
	// forgotPassword.confirmed=true;
	// forgotPassword.save();
	// forgotId=forgotPassword.id;
})

const email="hari@hardik.com";
const password="123456789";

describe("Create Group", async () => {
	
	it("Make Admin",async () => {
		// making sure we can register a user
		const client=new TestClient(getHost());
		const response=await client.makeAdmin("5cb50914ad610523a84014a6","5cb4fe7d88e872196c88f535");
		// const response = await request(getHost(),mutation(email,password));
		expect(response.data).toEqual({makeAdmin : null});
		
    });
    
    it("Remove Member",async () => {
		// making sure we can register a user
		const client = new TestClient(getHost());
		const response=await client.remove("5cb50914ad610523a84014a6","5cb4fe7d88e872196c88f535");
		// const response = await request(getHost(),mutation(email,password));
		expect(response.data).toEqual({remove : null});
		
    });

    it("Admin Leaves The Group",async () => {
		// making sure we can register a user
		const client = new TestClient(getHost());
        const response = await client.remove("5cb50914ad610523a84014a6","5cb4fe7d88e872196c88f535");
        const response1 = await client.remove("5cb50914ad610523a84014a6","5cb4fe7457c2a0196c845c88");
		// const response = await request(getHost(),mutation(email,password));
		expect(response.data).toEqual({remove : null});
		
    });

    it("Remove Admin",async () => {
		// making sure we can register a user
        const client = new TestClient(getHost());
        const response = await client.makeAdmin("5cb50914ad610523a84014a6","5cb4fe7d88e872196c88f535");
        const response1 = await client.remove("5cb50914ad610523a84014a6","5cb4fe7d88e872196c88f535");
		// const response = await request(getHost(),mutation(email,password));
		expect(response.data).toEqual({makeAdmin : null});
		
    });
    

});
// 	it("email not confirmed",async()=>{
// 		const client=new TestClient(getHost());
// 		const response=await client.register("no@no.com","whatever");
// 		const response2=await client.login("no@no.com","whatever");
// 		expect(response2.data).toEqual({
// 			login: [{
// 				path: "email",
// 				message: emailNotVerified
// 			}]
// 		});
// 		// User.findOne({email:"no@no.com"}).select('confirmed').exec(function(err,user){
// 		// 	user.confirmed=true;
// 		// 	user.save(function(err){
// 		// 		request(getHost(),loginMutation("no@no.com","whatever1")).then((response3)=>{
// 		// 			expect(response3).toEqual({
// 		// 				login: [{
// 		// 					path: "password",
// 		// 					message: invalidPassword
// 		// 				}]
// 		// 			});
// 		// 		});
// 		// 	})
// 		// })
// 		// User.findOne({email:"no@no.com"}).select('confirmed').exec(function(err,user){
// 		// 	user.confirmed=true;
// 		// 	user.save(function(err){
// 		// 		request(getHost(),loginMutation("no@no.com","whatever")).then((response4)=>{
// 		// 			expect(response4).toBeNull();
// 		// 		});
// 		// 	})
// 		// })
// 	});
// });

// describe("Me query",()=>{

// 	it("return null if no cookie",async ()=>{
// 		const client=new TestClient(getHost());
// 		const response=await client.me();
// 		expect(response.data.me).toBeNull();
// 	});

// 	it("get current user back",async ()=>{
// 		const client=new TestClient(getHost());
// 		await client.login("checking@checking.com","checking");

// 		const response2=await client.me();
// 		expect(response2.data.me.email).toEqual("checking@checking.com");
// 		expect(response2.data.me.id).toEqual(checkId);

// 		// checking logout
		
// 		await client.logout();
// 		const response=await client.me();
// 		expect(response.data.me).toBeNull();

// 		// checking multiple sesssions
// 		const sess1=new TestClient(getHost());
// 		const sess2=new TestClient(getHost());
// 		await sess1.login("checking@checking.com","checking");
// 		await sess2.login("checking@checking.com","checking");
// 		expect(await sess1.me()).toEqual(await sess2.me());
// 		await sess2.logout();
// 		expect(await sess1.me()).toEqual(await sess2.me());
// 	});
// });

// describe("forgot password",()=>{
// 	it("making sure it works", async ()=>{
// 		const client=new TestClient(getHost());
// 		await forgotPasswordLockAccount(forgotId,redis);
// 		const url=await createForgotPasswordLink("",forgotId,redis);
// 		const chunks=url.split("/");
// 		const key=chunks[chunks.length-1];

// 		// make sure you can't log in from locked account
// 		expect(await client.login("forgot@forgot.com","forgot")).toEqual({
// 			data:{
// 				login: [{
// 					path: "email",
// 					message: forgotPassword
// 				}]
// 			}
// 		});

// 		expect(await client.forgotPasswordChange("bd",key)).toEqual({
// 			data:{
// 				forgotPasswordChange: [{
// 					path: "newPassword",
// 					message: passwordNotLongEnough
// 				}]
// 			}
// 		});

// 		const response=await client.forgotPasswordChange(newPassword,key);
// 		expect(response.data).toEqual({
// 			forgotPasswordChange:null
// 		});

// 		// // make sure key expires after change password
// 		expect(await client.forgotPasswordChange("checkingitexpires",key)).toEqual({
// 			data:{
// 				forgotPasswordChange: [{
// 					path: "key",
// 					message: expiredKeyError
// 				}]
// 			}
// 		});

// 		const resp=await client.login("forgot@forgot.com",newPassword);
// 		console.log(resp.data.login);
// 		expect(await client.me()).toEqual({
// 			data:{
// 				me:{
// 					id: forgotId,
// 					email: "forgot@forgot.com"
// 				}
// 			}
// 		});
// 	});
// });