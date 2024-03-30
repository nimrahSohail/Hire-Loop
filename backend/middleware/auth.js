const jwt= require('jsonwebtoken');
const Errorhandler = require('../utilis/errorhandler');
const catchAsyncError=require('./catchAsyncError');
const User=require('../model/userModel')

exports.isAuthenticatedUser=catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    // console.log(token)
    if (!token){
        return next(new Errorhandler('please login to access this resource',401));
    }
    const decodedData=jwt.verify(token,process.env.JWT_Secret);
    req.user=await User.findById(decodedData.id)
    next();
});

exports.authorizeRole=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            new Errorhandler('You are not allowed to delete it',403)
        }
        next()
    }
}