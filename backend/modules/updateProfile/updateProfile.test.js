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

    const client4 = new TestClient(getHost());
    const response41 = await client4.register("r4@gmail.com","password", "8160981960","r4");
    const response42 = await client4.login("r4@gmail.com","password");

    const client5 = new TestClient(getHost());
    const response51 = await client5.register("r5@gmail.com","password", "8160981960","r5");
    const response52 = await client5.login("r5@gmail.com","password");

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


})

const email="hari@hardik.com";
const password="123456789";

describe("Update Profile Page", async () => {
	
	it("Update Profile Photo",async () => {
		// making sure we can register a user
		const client=new TestClient(getHost());
		const response=await client.updateProfile("image1","5cb4fe7d88e872196c88f535");
		// const response = await request(getHost(),mutation(email,password));
		expect(response.data).toEqual({updateProfile : null});
		
    });

    it("Update Username",async () => {
		// making sure we can register a user
		const client=new TestClient(getHost());
		const response=await client.updateUsername("image1","5cb4fe7d88e872196c88f535");
		// const response = await request(getHost(),mutation(email,password));
		expect(response.data).toEqual({updateUsername : null});
		
    });

});