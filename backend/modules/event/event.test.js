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
expiredKeyError
} from '../forgotPassword/errorMessages';
import {forgotPasswordLockAccount} from '../../utils/forgotPasswordLockAccount';

let getHost=()=>'';
let userId="";
let checkId="";
let forgotId="";
const redis=new Redis();
let newPassword="pwdChanged"

var id1;

beforeAll(async()=>{
const app=await startServer();
const {port}=app.address();
getHost=()=>`http://127.0.0.1:${port}`;
const client=new TestClient(getHost());
const response=await client.register("temp@gmail.com","temp", "9999999999","temp");
const response1 = await client.login("temp@gmail.com","9999999999");
id1 = response1.data.userId;
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

// describe("Register user", async () => {
  
//   // it("Check for duplicate emails",async () => {
//   //  // making sure we can register a user
//   //  const client=new TestClient(getHost());
//   //  const response=await client.register("s@gmail.com","password", "8160981960","smit");
//   //  // const response = await request(getHost(),mutation(email,password));
//   //  expect(response.data).toEqual({register:[{
//   //      "path": null,
//   //      "message": null
//   //  }]});
      
//   //  const response2=await client.register("s@gmail.com","password", "8160981961","smit1");

//   //  expect(response2.data).toEqual({register:[
//   //      {
//   //          "path": "email",
//   //          "message": duplicateEmail
//   //      }
//   //  ]

//   //  })
//   // });
//   //-----------------------------------------------------------------------------------------
//   // it("Check for duplicate username",async () => {
//   //  // making sure we can register a user
//   //  const client = new TestClient(getHost());
      
//   //  const response = await client.register("s1@gmail.com","password", "8160981960","smit2");
//   //  // const response = await request(getHost(),mutation(email,password));
//   //  expect(response.data).toEqual({register : [{
//   //      "path" : null,
//   //      "message" : null
//   //  }]});
      
//   //  const response2= await client.register("s2@gmail.com","password", "8160981961","smit2");

//   //  expect(response2.data).toEqual({register : [{
//   //      "path" : "username",
//   //      "message" : duplicateUsername
//   //  }]})
//   // });
//   //--------------------------------------------------------------------------------------------
//   // it("Check for valid phone number",async () => {
//   //  // making sure we can register a user
//   //  const client = new TestClient(getHost());
      
//   //  const response = await client.register("s3@gmail.com","password", "816098196","smit3");
//   //  // const response = await request(getHost(),mutation(email,password));
//   //  expect(response.data).toEqual({register : [{
//   //      "path" : "phone",
//   //      "message" : "Length Not Valid"
//   //  }]});
//   // });
//   //-----------------------------------------------------------------------------------------------

//   // it("Check for valid phone number",async () => {
//   //  // making sure we can register a user
//   //  const client = new TestClient(getHost());
      
//   //  const response = await client.register("s4@gmail.com","password", "81609819600","smit4");
//   //  // const response = await request(getHost(),mutation(email,password));
//   //  expect(response.data).toEqual({register : [{
//   //      "path" : "phone",
//   //      "message" : "Length Not Valid"
//   //  }]});
//   // });
//   //--------------------------------------------------------------------------------------------------
//   // it("Email not valid",async () => {
//   //  // making sure we can register a user
//   //  const client = new TestClient(getHost());
      
//   //  const response = await client.register("a1","password", "81609819600","smit6");
//   //  // const response = await request(getHost(),mutation(email,password));
//   //  expect(response.data).toEqual({register : [{
//   //      "path" : "email",
//   //      "message" : emailNotLongEnough
//   //  },{
//   //      "path" : "email",
//   //      "message" : invalidEmail
//   //  }]});
//   // });
//   //-------------------------------------------------------------------------------------------------

//   // it("Username Not Null",async () => {
//   //  // making sure we can register a user
//   //  const client = new TestClient(getHost());
      
//   //  const response = await client.register("s7@gmail.com","password", "8160981960","");
//   //  // const response = await request(getHost(),mutation(email,password));
//   //  expect(response.data).toEqual({register : [{
//   //      "path" : "username",
//   //      "message" : usernameNotLongEnough
//   //  }]});
//   // });

// });



describe("Creating Event",()=>{
   it("Name Cannot Be Null",async ()=>{
    const client=new TestClient(getHost());
    const response=await client.createEvent(id1,"","imageLink","description1","2020/02/23","time1",22.22,20.21);
    expect(response.data).toEqual({
       createEvent: [{

           path : "name",
           message : "Name Cannot Be Null"

       }]
    })
});

   it("Imagelink Cannot Be Null",async ()=>{
   const client=new TestClient(getHost());
   const response=await client.createEvent(id1,"smit1","","description1","2020/02/23","time1",22.22,20.21);
   expect(response.data).toEqual({
      createEvent: [{

       path : "imageLink",
       message : "Image Link Cannot Be Null"

      }]})
   });

   it("Description Cannot Be Null",async ()=>{
       const client=new TestClient(getHost());
       const response=await client.createEvent(id1,"smit1","abcd.com","","2020/02/23","time1",22.22,20.21);
       expect(response.data).toEqual({
          createEvent: [{
  
           path : "description",
            message : "Description Cannot Be Null"
  
          }]})
       });

       it("Time Cannot Be Null",async ()=>{
           const client=new TestClient(getHost());
           const response=await client.createEvent(id1,"smit1","abcd.com","sdkjsdj","2020/02/23","",22.22,20.21);
           expect(response.data).toEqual({
               createEvent: [{
      
                   path : "time",
                    message : "Time Cannot Be Null"
      
               }]})
           });
  
});
//   it("email not confirmed",async()=>{
//       const client=new TestClient(getHost());
//       const response=await client.register("no@no.com","whatever");
//       const response2=await client.login("no@no.com","whatever");
//       expect(response2.data).toEqual({
//           login: [{
//               path: "email",
//               message: emailNotVerified
//           }]
//       });
//       // User.findOne({email:"no@no.com"}).select('confirmed').exec(function(err,user){
//       //  user.confirmed=true;
//       //  user.save(function(err){
//       //      request(getHost(),loginMutation("no@no.com","whatever1")).then((response3)=>{
//       //          expect(response3).toEqual({
//       //              login: [{
//       //                  path: "password",
//       //                  message: invalidPassword
//       //              }]
//       //          });
//       //      });
//       //  })
//       // })
//       // User.findOne({email:"no@no.com"}).select('confirmed').exec(function(err,user){
//       //  user.confirmed=true;
//       //  user.save(function(err){
//       //      request(getHost(),loginMutation("no@no.com","whatever")).then((response4)=>{
//       //          expect(response4).toBeNull();
//       //      });
//       //  })
//       // })
//   });
// });

// describe("Me query",()=>{

//   it("return null if no cookie",async ()=>{
//       const client=new TestClient(getHost());
//       const response=await client.me();
//       expect(response.data.me).toBeNull();
//   });

//   it("get current user back",async ()=>{
//       const client=new TestClient(getHost());
//       await client.login("checking@checking.com","checking");

//       const response2=await client.me();
//       expect(response2.data.me.email).toEqual("checking@checking.com");
//       expect(response2.data.me.id).toEqual(checkId);

//       // checking logout
      
//       await client.logout();
//       const response=await client.me();
//       expect(response.data.me).toBeNull();

//       // checking multiple sesssions
//       const sess1=new TestClient(getHost());
//       const sess2=new TestClient(getHost());
//       await sess1.login("checking@checking.com","checking");
//       await sess2.login("checking@checking.com","checking");
//       expect(await sess1.me()).toEqual(await sess2.me());
//       await sess2.logout();
//       expect(await sess1.me()).toEqual(await sess2.me());
//   });
// });

// describe("forgot password",()=>{
//   it("making sure it works", async ()=>{
//       const client=new TestClient(getHost());
//       await forgotPasswordLockAccount(forgotId,redis);
//       const url=await createForgotPasswordLink("",forgotId,redis);
//       const chunks=url.split("/");
//       const key=chunks[chunks.length-1];

//       // make sure you can't log in from locked account
//       expect(await client.login("forgot@forgot.com","forgot")).toEqual({
//           data:{
//               login: [{
//                   path: "email",
//                   message: forgotPassword
//               }]
//           }
//       });

//       expect(await client.forgotPasswordChange("bd",key)).toEqual({
//           data:{
//               forgotPasswordChange: [{
//                   path: "newPassword",
//                   message: passwordNotLongEnough
//               }]
//           }
//       });

//       const response=await client.forgotPasswordChange(newPassword,key);
//       expect(response.data).toEqual({
//           forgotPasswordChange:null
//       });

//       // // make sure key expires after change password
//       expect(await client.forgotPasswordChange("checkingitexpires",key)).toEqual({
//           data:{
//               forgotPasswordChange: [{
//                   path: "key",
//                   message: expiredKeyError
//               }]
//           }
//       });

//       const resp=await client.login("forgot@forgot.com",newPassword);
//       console.log(resp.data.login);
//       expect(await client.me()).toEqual({
//           data:{
//               me:{
//                   id: forgotId,
//                   email: "forgot@forgot.com"
//               }
//           }
//       });
//   });
// });
