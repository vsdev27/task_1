import { jwt } from "../..";
import { logintokenmodel } from "../../models/user/logintoken";



export async function VALIDATE_USER(req:any, callback:any) {

    var sendData = {
        ReturnCode : 200,
        err : 0,
        data : {},
        msg : ""
    };
    if (!req.headers['authorization']) {
        sendData['ReturnCode'] = 406;
        sendData['msg'] = 'No access token provided';
        callback(sendData);
    } else {
        try {
            const accessToken = req.headers.authorization.split(' ')[1];
            const decodeduser = jwt.verify(accessToken, process.env.SECRET_KEY);
            
        var condition = {
            user_id: decodeduser._id,
            token: accessToken
        }
        var tokendata = await logintokenmodel.find(condition);
        if(tokendata.length > 0) {

                sendData['ReturnCode'] = 200;
                sendData['data'] = decodeduser;
                callback(sendData);
          
        } else {
            sendData['ReturnCode'] = 401;
            sendData['err'] = 1;
            sendData['msg'] = "Token expired";
            callback(sendData);
        }
        } catch (error) {
            sendData['ReturnCode'] = 401;
            sendData['err'] = 1;
            sendData['msg'] = "Invalid Authorization Token";
            callback(sendData);
        }
    }
}