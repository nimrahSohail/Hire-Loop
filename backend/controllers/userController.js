const Errorhandler = require('../utilis/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User=require('../model/userModel');
const sendToken = require('../utilis/jwttoken');
const sendEmail=require('../utilis/sendEmail.js');
const crypto=require('crypto');

exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const {username,email,password}=req.body;
    const user = await User.create({
        username,email,password,
        avatar:{
            public_id:"this is profile pic",
            url:"profilepicurl"
        }
    })
    sendToken(user,201,res)
})

// UserLogin
exports.loginUser=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;

    // checking if email & password are given
    if(!email && !password){
        return next(new Errorhandler("PLease enter email and password both",400))
    }
    const user =await User.findOne({email}).select('+password');
    if(!user){
        return next(new Errorhandler("Invalid Email and password"),401)
    }
    const isPasswordMatch=user.comparePassword(password);
    if(!isPasswordMatch){
        return next(new Errorhandler("Invalid Email and password"),401)
    }
    sendToken(user,200,res)
});

// logoutUser
exports.logoutUser=catchAsyncError(async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"logged out!"
    })
});

// forgot Password

exports.forgotPassword=catchAsyncError(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email});
    if (!user){
        return next(new Errorhandler('User not found',404))
    }
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message=`Your pasword reset token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it`;

    try{
        await sendEmail({
            email:user.email,
            subject:'HireLoop Password Recovery',
            message,
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});

        return next(new Errorhandler(error.message,500))
    }

});
// reset Password

exports.resetPassword=catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken=crypto.
    createHash('sha256').
    update(req.params.token).
    digest('hex');
    
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });
    if (!user){
        return next(new Errorhandler('Reset password token is invalid or has been expired',400))
    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new Errorhandler('Password doesnot match',400)) ;
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save()
    sendToken(user,200,res)
})
// get user details
exports.getUserDetails=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user
    })
})
// Update User Password
exports.updatePassword=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.user.id).select('+password')

    const isPasswordMatch=await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatch){
        return next(new Errorhandler("Old password is incorrect"),401)
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new Errorhandler('Password doesnot match',400)) ;
    }
    user.password=req.body.newPassword;
    await user.save()

    res.status(200).json({
        success:true,
        user
    })
})
