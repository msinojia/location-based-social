import 'package:flock/graphql/user/mutation/sendOTP.dart';
import 'package:flock/profile/header.dart';
import 'package:flock/user/EnterOTP.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class SendOTPScreen extends StatefulWidget {
  @override
  _SendOTPScreenState createState() => _SendOTPScreenState();
}

class _SendOTPScreenState extends State<SendOTPScreen> {
  final TextEditingController _emailController = TextEditingController();
  String _emailValidate = "";

  @override
  Widget build(BuildContext context) {
    final email = TextField(
      controller: _emailController,
      key: Key("email"),
      keyboardType: TextInputType.emailAddress,
      autofocus: false,
      decoration: InputDecoration(
        errorText: _emailValidate != "" ? _emailValidate : null,
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15.0),
            borderSide: BorderSide(color: Colors.greenAccent, width: 2.0)),
        hintText: 'Email',
        contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15.0),
            borderSide: BorderSide(color: Colors.teal)),
      ),
    );
    return Scaffold(
      appBar: Header(
        title: Text("Forgot Password"),
        leading: true,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            email,
            Mutation(
              sendForgotPasswordEmail,
              builder: (
                sendForgotPasswordEmail, {
                bool loading,
                Map data,
                Exception error,
              }) {
                return MaterialButton(
                  onPressed: () {
                    if (_emailController.text.isEmpty) {
                      setState(() {
                        _emailValidate = "Email should not be empty!";
                      });
                    } else {
                      showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return Center(
                              child: CircularProgressIndicator(),
                            );
                          });
                      sendForgotPasswordEmail({'email': _emailController.text});
                    }
                    //TODO: show loaidng icon here
                  },
                  child: Text("Click here to send OTP"),
                  color: Colors.green,
                );
              },
              onCompleted: (Map<String, dynamic> data) {
                //TODO: hide loading icon here.
                var route = MaterialPageRoute(
                    builder: (BuildContext context) =>
                        EnterOTP(_emailController.text));
                Navigator.of(context).pop();
                Navigator.of(context).push(route);
              },
            ),
          ],
        ),
      ),
    );
  }
}
