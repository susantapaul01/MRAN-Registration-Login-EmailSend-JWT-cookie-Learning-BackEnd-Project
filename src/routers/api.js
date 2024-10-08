import express from "express";
const router = express.Router();

import * as UserController from "../controllers/userController.js";
import authMiddleware from "../middlewarew/authMiddleware.js";

// user
router.post('/registration', UserController.Registration);
router.post('/login', UserController.Login);
router.get('/profile', authMiddleware, UserController.ReadProfile);
router.post('/logout', UserController.Logout);
router.post('/sendemail', UserController.SendEmail);
router.post('/verify_email/:email', UserController.VerifyEmail);
router.post('/verify_OTP/:email/:otp', UserController.VerifyOTP);
router.post('/ResetPassword/:email/:otp', UserController.ResetPassword);


export default router;

