
var md5 = require('md5')
import { jwt } from "../..";
import { logintokenmodel } from "../../models/user/logintoken";
import { userModel } from "../../models/user/user";

export async function REGISTER1(data: any, callback: any) {

    var sendData = {
        ReturnCode: 200,
        err: 0,
        data: {},
        msg: "",
    };

    data.password = md5(data.password)

    var condition = {
        email: data.email,
    }

    var findata = await userModel.findOne(condition)

    if (findata) {
        sendData.err = 1
        sendData.msg = 'User is already registered ',
            callback(sendData)
    }
    else {
        var create = await userModel.create(data)
        sendData.data = create,
            sendData.ReturnCode = 200,
            sendData.msg = 'Registration successful',
            callback(sendData);
    }
}


export async function LOGIN(data: any, callback: any) {

    var sendData = {
        ReturnCode: 200,
        err: 0,
        data: {},
        msg: "",
    };

    var condition: any = {
        email: data.email,
    }

    var findata = await userModel.findOne(condition)
    if (findata) {

        condition.password = md5(data.password)

        var finduser = await userModel.findOne(condition)
        if (finduser) {
            var payload = {
                _id: finduser._id
            }
            var Token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: "24h",
            });

            const tokenCreate = {
                user_id: finduser._id,
                token: Token,
            };
            const tokenData = await logintokenmodel.create(tokenCreate);
            sendData.data = {
                userdata: finduser,
                token: Token
            }
            sendData.msg = 'User is Logged in ',
                callback(sendData)
        }

        else {
            sendData.err = 1
            sendData.msg = 'Please Enter valid password',
                callback(sendData);
        }

    }
    else {
        sendData.err = 1
        sendData.msg = 'This email is not registered ! please Register it',
            callback(sendData);
    }
}


export async function GET_PROFILE(data: any, callback: any) {

    var sendData = {
        ReturnCode: 200,
        err: 0,
        data: {},
        msg: "",
    };

    var user_id = data.userData._id

    var finduser = await userModel.findOne({ _id: user_id })
    if (finduser) {
        sendData.data = finduser
        callback(sendData)
    }
    else {
        sendData.msg = "no data found"
        sendData.err = 1
        callback(sendData)
    }
}


export async function LOGOUT(data: any, callback: any) {

    var sendData = {
        ReturnCode: 200,
        err: 0,
        data: {},
        msg: "",
    };

    var userData = data.userData;
    var token = data.token.replace("Bearer ", "");

    const userlogincondition = {
      user_id:(userData._id.toString()),
      token: token,
    };
    var loginData = await logintokenmodel.findOne(userlogincondition);

    if (loginData) {

      const deletetoken = await logintokenmodel.deleteOne(userlogincondition);
      sendData["ReturnCode"] = 200;
      sendData["err"] = 0;
      sendData["msg"] = "logout successful";
      callback(sendData);
    } else {
      sendData["ReturnCode"] = 200;
      sendData["err"] = 1;
      sendData["msg"] ="no data found";
      callback(sendData);
    }
}