const mongoose = require('mongoose');
const profileSchema=mongoose.Schema({
    
    firstName:{
        type:String,
        required:[true,'Please Enter first name'],
        trim:true
        },
    lastName:{
        type:String,
        required:[true,'Please Enter last name'],
        trim:true
    },
    title:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:[true,"Please Enter your Country name"]
    },
    city:{
        type:String
    },
    address:{
        type:String,
    },
    contactNumber:{
        type:String,
        required:[true,"Please enter your contact number"],
        maxLength:[11,"Please enter correct number"],
        minLength:[11,"Please enter correct number"]
    },
    description:{
        type:String,
        // required:[true,"Please Enter description of yourself"]
    },
    links:[{
        title:{
        type:String}
    }],
    educationBackground:[{
        title:{
            type:String,
            required:true
        },
        year_start:{
            type:String,
            required:true
        },
        year_end:{
            type:String,
            required:true
        },
        edu_description:{
            type:String,
            required:[true,"Please Enter description of atleast 20 words"],
            maxLength:[50,"Description must not exceed 50 words"]
        }

}],
    experience:[{
        title:{
            type:String,
            required:true
        },
        position:{
            type:String,
            required:true
        },
        years:{
            type:String,
            required:true
        },
        exp_description:{
            type:String,
            required:[true,"Please Enter description of atleast 20 words"],
            maxLength:[50,"Description must not exceed 50 words"]
        }
}],
    projects:[{
        title:{
            type:String,
            required:true
        },
        link:{
            type:String,
            required:true
        },
        description:{
            type:String,
            require:true
        }
    }],
    softSkill:[{
        title:{
            type:String,
            required:true
        },
        default:0
    }],
        certification:[{
            title:{
                type:String,
                required:true
            }
        }],
        hobbies:[{
            title:{
                type:String,
                required:true
            }
        }],
        other:[
            {
                title:{
                type:String,
                required:true
                },
                other_description:{
                    type:String,
                    maxLength:[50,"Description must not exceed 50 words"]
                }

            }
        ],
        createdAt:{
            type:Date,
            default:Date.now
        }


    
    
});

module.exports=mongoose.model('Profile',profileSchema);