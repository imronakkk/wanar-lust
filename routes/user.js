const express=require('express');
const wrapAsync = require('../utils/wrapAsync/wrapAsync');
const router=express.Router();
const User=require('../models/user.js');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController=require('../controllers/user.js')


router.route('/signUp')
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.createUser));


router.route('/logIn')
.get(userController.renderLogInForm)
.post(saveRedirectUrl,passport.authenticate(
    'local',
    {
        failureRedirect:'/login',
        failureFlash:true
    }
),userController.LogIn);


router.get('/logOut',userController.LogOut)


module.exports=router;