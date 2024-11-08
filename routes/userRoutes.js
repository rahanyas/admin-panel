import express from "express";
const router = express.Router();
import {loginPage, signupPage, handleSignup, homePage, handelLogin, handleLogout}from "../controllers/userController.js";


router.get('/',  loginPage);

router.post('/signup', signupPage);

router.post('/sign-in', handleSignup);

router.post('/login', handelLogin);

router.get('/home',homePage);

router.post('/logout', handleLogout);

export default router;