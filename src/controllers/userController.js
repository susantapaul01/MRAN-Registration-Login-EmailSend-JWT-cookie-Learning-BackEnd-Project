import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import md5 from "md5";
import { TokenEncode } from "../utils/tokenUtils.js";
import { EmailSend } from "../utils/emailSend.js";
let ObjectID = mongoose.Types.ObjectId;
//=== Create User
export const Registration = async (req, res) => {
    try {
        let data = req.body;
        let email = data.email;
            data.password = md5(req.body['password']);
        let user = await userModel.find({ 'email': email });
        if(user.length> 0) {
            return res.status(409).json({ status: "error", messege: "already Registered"})
        }
        else {
            let result = await userModel.create(data)
            return res.status(200).json({ status: "success", messege: "Registration Successful", data: result });
        }
    }
    catch(e) {
        return res.json({ status: "success", messege: e.toString() })
    }
}


//=== User VerifyLogin
export const VerifyLogin = async (req, res) => {
    try {
            return res.json({ status: "success", messege: "VerifyLogin Successful" })
    }
    catch(e) {
        return res.json({ status: "success", messege: e.toString() })
    }
}


//=== User Login
export const Login = async (req, res) => {
    try {
        let data = req.body;
            data.password = md5(req.body.password);
        let matchStage = { $match: data};
        let projection = { $project: { "email": 1, "firstName": 1 }};
        let user = await userModel.aggregate([
            matchStage,
            projection
        ])
        if(user.length > 0) {
            let token = TokenEncode(user[0]['email'], user[0]['_id']);
            // cookie Setting
            let options = {
                maxAge: 5*24*60*60*1000,
                httpOnly: true,
                sameSite: "None",
                secure: true
            }
            res.cookie("Token", token, options);
            return res.status(200).json({ status: "success", messege: "Login Successful", data: user})
        } else {
            return res.status(404).json({ status: "error", messege: "email or password dose not match."});
        }
    }
    catch(e) {
        return res.status(404).json({ status: "success", messege: e.toString() })
    }
}


//=== Get User Profile
export const ReadProfile = async (req, res) => {
    try {
        let email = req.headers.email;
        let data = await userModel.findOne({'email': email})
        return res.status(200).json({ status: "success", messege: "Profile Read Successful", data: data})
    }
    catch(e) {
        return res.status(401).json({ status: "fail", messege: e.toString() })
    }
}



//=== User Logout
export const Logout = async (req, res) => {
    try {
        await res.clearCookie('Token');
        return res.status(200).json({ status: "success", messege: "Logout Successful"})
    }
    catch(e) {
        return res.status(404).json({ status: "success", messege: e.toString() })
    }
}


export const SendEmail = async (req, res) => {
    try {
        let reqBody = req.body;
        let emailTo = reqBody.email;
        let emailText = reqBody.emailText;
        let emailSubject = reqBody.emailSubject;

        let data = await EmailSend(emailTo, emailSubject, emailText);
        return res.status(200).json({ status: "success", data: data });
    }
    catch(e) {
        return res.json({ status: "success", messege: e.toString() })
    }
}

