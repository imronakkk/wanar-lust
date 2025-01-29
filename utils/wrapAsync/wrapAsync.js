function wrapAsync(f1){
    return function f2(req,res,next){
        f1(req,res,next).catch(err=>next(err));
    }
}
module.exports=wrapAsync;