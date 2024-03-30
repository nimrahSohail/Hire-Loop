const Profile=require('../model/profileModel');
const Errorhandler = require('../utilis/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')

// create profile

exports.createProfile=catchAsyncError(async(req,res,next)=>{
    const profile=await Profile.create(req.body);
    res.status(201).json({
        success:true,
        profile
})
});
//  get all profiles
exports.getAllProfiles=catchAsyncError(async(req,res)=>{
    const profileCount=await Profile.countDocuments();
    const profiles= await Profile.find(req.body);
    res.status(200).json({
        success:true,
        profiles,
        profileCount
    })
})

// get profileDetail
exports.getProfileDetail=catchAsyncError(async(req,res,next)=>{
    const profile = await Profile.findById(req.params.id);
    if(!profile){
        return next(new Errorhandler("Profile not found",404))
    }
    res.status(200).json({
        success:true,
        profile,
        
    })
})
// update profile
exports.updateProfile=catchAsyncError(async(req,res,next)=>{
    console.log("Yesss")
    let profile = await Profile.findById(req.params.id);
    if(!profile){
        return next(new Errorhandler("Profile not found",404))
    }
    profile=await Profile.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false})
        res.status(200).json({
            success:true,
            profile
        })
})
// delete profile --- Admin

exports.deleteProfile=catchAsyncError(async(req,res,next)=>{
    console.log("Deleteeee");
    let profile = await Profile.findById(req.params.id);
    if(!profile){
        return next(new Errorhandler("Profile not found",404))
    }
    // profile=await Profile.findByIdAndDelete(req.params.id,req.body,{
    //     new:true,
    //     runValidators:true,
    //     useFindAndModify:false})
    profile.remove();
        res.status(200).json({
            success:true,
            profile
        })
})