const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please enter username"],
        maxLength:[10,"Username cannot exceed to 10 characters"]
    },
    email:{
        type:String,
        required:[true,'Please Enter email address'],
        unique:true,
        validate:[validator.isEmail,"Please Enter valid email address"]
    },
    password:{
        type:String,
        required:[true,'Please a password'],
        minLength:[8,"Password must be greater than 8 charcters"],
        selcect:false
    },
    avatar:{
        public_id:{
        type:String},
        url:{
            type:String,
            required:true}
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
});

userSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        next()
    }
    this.password=await bcrypt.hash(this.password,10);
})

// JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_Secret,{
        expiresIn:process.env.JWT_Expire,
    })
}

// Compare Password
userSchema.methods.comparePassword=async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password)
};

// reset passwordToken Generator
userSchema.methods.getResetPasswordToken=function(){
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hashing and adding resetPassword Token
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    
    this.resetPasswordExpire=Date.now()+15*60*1000;
    return resetToken;
}

module.exports=mongoose.model("User",userSchema);