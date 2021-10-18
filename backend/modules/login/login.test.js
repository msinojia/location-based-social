import {request} from 'graphql-request';
import 'babel-polyfill';
import axios from 'axios';
// import mongoose from 'mongoose';
var Redis = require('ioredis');
import fetch from 'node-fetch';

import {createConfirmEmailLink} from '../../utils/createConfirmEmailLink';
import {createForgotPasswordLink} from '../../utils/createForgotPasswordLink';

import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
  duplicateUsername,
  usernameNotLongEnough
} from './errorMessages';

import User from '../../models/User';
import {startServer} from '../../startServer';
import {TestClient} from '../../utils/testClient';
import {
  invalidLogin,
  emailNotVerified,
  invalidPassword,
  forgotPassword
} from './errorMessages';
import {
  expiredKeyError
} from '../forgotPassword/errorMessages';
import {forgotPasswordLockAccount} from '../../utils/forgotPasswordLockAccount';

let getHost=()=>'';
let userId="";
let checkId="";
let forgotId="";
const redis=new Redis();
let newPassword="pwdChanged"

beforeAll(async()=>{
  const app=await startServer();
  const {port}=app.address();
  getHost=()=>`http://127.0.0.1:${port}`;
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

describe("Checking Login functionality",()=>{
  it("Email not found in database at the time of login",async ()=>{
    const client=new TestClient(getHost());
    const response=await client.login("no@no1.com","whatever");
    expect(response.data).toEqual({
      login: [{
        path: "email",
        message: invalidLogin
      }]
    })
   });
   it("Invalid Password",async () => {
   const client = new TestClient(getHost());
   const r=await client.register("s11@gmail.com","12345","1234567890","fda")
   const r1=await client.register("r12@gmail.com","12345","1234567890","r12")
   const response = await client.login("s11@gmail.com","1234");
   // const response = await request(getHost(),mutation(email,password));
   expect(response.data).toEqual({login : [{
    "path" : "password",
       "message" : invalidPassword
  }]});
});
  it("Invalid Email",async () => {
  const client = new TestClient(getHost());
  
  const r=await client.register("s12@gmail.com","12345","1234567890","feda")
   const response = await client.login("s121@gmail.com","12345");
   // const response = await request(getHost(),mutation(email,password));
   expect(response.data).toEqual({login : [{
       "path" : "email",
       "message" : invalidLogin
       }]});
  });
  
  it("Password Not Null",async () => {
  const client = new TestClient(getHost());
  const response = await client.login("s11@gmail.com","");
  // const response = await request(getHost(),mutation(email,password));
  expect(response.data).toEqual({login : [{
    "path" : "password",
    "message" : invalidPassword
    }]});
  });



});

// describe("Me query",()=>{

//  it("return null if no cookie",async ()=>{
//    const client=new TestClient(getHost());
//    const response=await client.me();
//    expect(response.data.me).toBeNull();
//  });

//  it("get current user back",async ()=>{
//    const client=new TestClient(getHost());
//    await client.login("checking@checking.com","checking");

//    const response2=await client.me();
//    expect(response2.data.me.email).toEqual("checking@checking.com");
//    expect(response2.data.me.id).toEqual(checkId);

//    // checking logout
    
//    await client.logout();
//    const response=await client.me();
//    expect(response.data.me).toBeNull();

//    // checking multiple sesssions
//    const sess1=new TestClient(getHost());
//    const sess2=new TestClient(getHost());
//    await sess1.login("checking@checking.com","checking");
//    await sess2.login("checking@checking.com","checking");
//    expect(await sess1.me()).toEqual(await sess2.me());
//    await sess2.logout();
//    expect(await sess1.me()).toEqual(await sess2.me());
//  });
// });

// describe("forgot password",()=>{
//  it("making sure it works", async ()=>{
//    const client=new TestClient(getHost());
//    await forgotPasswordLockAccount(forgotId,redis);
//    const url=await createForgotPasswordLink("",forgotId,redis);
//    const chunks=url.split("/");
//    const key=chunks[chunks.length-1];

//    // make sure you can't log in from locked account
//    expect(await client.login("forgot@forgot.com","forgot")).toEqual({
//      data:{
//        login: [{
//          path: "email",
//          message: forgotPassword
//        }]
//      }
//    });

//    expect(await client.forgotPasswordChange("bd",key)).toEqual({
//      data:{
//        forgotPasswordChange: [{
//          path: "newPassword",
//          message: passwordNotLongEnough
//        }]
//      }
//    });

//    const response=await client.forgotPasswordChange(newPassword,key);
//    expect(response.data).toEqual({
//      forgotPasswordChange:null
//    });

//    // // make sure key expires after change password
//    expect(await client.forgotPasswordChange("checkingitexpires",key)).toEqual({
//      data:{
//        forgotPasswordChange: [{
//          path: "key",
//          message: expiredKeyError
//        }]
//      }
//    });

//    const resp=await client.login("forgot@forgot.com",newPassword);
//    console.log(resp.data.login);
//    expect(await client.me()).toEqual({
//      data:{
//        me:{
//          id: forgotId,
//          email: "forgot@forgot.com"
//        }
//      }
//    });
//  });
// });
