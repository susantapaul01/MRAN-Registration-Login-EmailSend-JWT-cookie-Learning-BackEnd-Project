import express from "express";
const router = express.Router();

import * as UserController from "../controllers/userController.js";
import authMiddleware from "../middlewarew/authMiddleware.js";

// user
router.post('/registration', UserController.Registration);
router.post('/login', UserController.Login);
router.post('/verifylogin', UserController.VerifyLogin);
router.get('/profile', authMiddleware, UserController.ReadProfile);
router.post('/logout', UserController.Logout);
router.post('/sendemail', UserController.SendEmail);


export default router;


