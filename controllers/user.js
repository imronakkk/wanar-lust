const User=require('../models/user');


module.exports.renderSignUpForm=(req,res)=>{
    res.render('users/signUp.ejs');
};

module.exports.createUser=async (req,res)=>{
    try{

        let {username,email,password}=req.body;
        let user=new User({email,username});
        let result=await User.register(user,password);
        // console.log(result);
        // console.log(req.user);
        // console.log(req.cookies);
        // console.log(req.session);
        req.login(result,(err)=>{
            // console.log(req.user);
            // console.log(req.cookies);
            // console.log(req.session);
            req.flash("success","userName created");
            res.redirect('/listings');
        })
        // res.redirect('/listings');
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signUp');
    }
}


module.exports.renderLogInForm=(req,res)=>{
    res.render('users/login.ejs')
};
module.exports.LogIn=(req,res)=>{
    req.flash('success','login successful');
    // console.log("login");
    if(res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl);
    else
    res.redirect('/listings');
}
module.exports.LogOut=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success","you are successfully log out");
            
            res.redirect('/listings');
        }
    });
}