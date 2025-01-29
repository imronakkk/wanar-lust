if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}
// console.log(process.env.CLOUD_NAME);

const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require("path");
// const exp = require("constants");//pta nhi q bnaa h🥲🥲
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
const multer=require('multer');
const ExpressError = require('./utils/ExpresError/ExpressError.js');




main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(process.env.ATLAS_URL);
}




app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());//parsing the data which is sending via hopscoth
app.engine('ejs', ejsMate);
app.use(cookieParser());//for getting the value of cookie 


const store=  MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    touchAfter: 24 * 3600 ,// time period in seconds
    crypto: {
        secret: process.env.SECRET
      }
  });
  store.on('error',(err)=>{
    console.log('session error:-',err)
  })
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    // console.log(req.user);
    res.locals.currUser=req.user;
    console.log("s,f,user");
    next();
})




// app.get("/",(req,res)=>{
//     console.log(req.cookies);
//     console.log("hello call");
    
//     res.send("hello, I am root");
// })
app.get('/demouser',async(req,res)=>{
    let fakeUser=new User({
        email:"nhi rha",
        username:"sonu28gpt"
    });
   const result= await User.register(fakeUser,"hii");
   res.send(result);
})


app.get('/',(req,res)=>{
    res.render("listings/first.ejs");
})
app.use('/listings',listingRouter);
app.use('/listings/:id/review',reviewRouter);
app.use('/',userRouter);

app.use('*',(req,res,next)=>{
    next(new ExpressError(500,'page not found'));
});
//-----------------------error middleware---------------------------
    app.use((err,req,res,next)=>{
        console.log('error middleware');
        // console.log(err);
        let {status=305,message="don't know"}=err;
        // res.status(status).send(message);
        res.status(status).render("listings/error.ejs",{err});
     
    })
    
app.listen(8080,()=>{
    console.log("server start");
});

    
  