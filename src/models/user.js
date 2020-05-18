const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("E-mail is not Correct");
            }
        }
    },
    password: {
        type: String,
        required:true,
        minlength: [6, "It's cannot be smaller than 6 charachters."]
    },
    name: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    avatar: {
        type: Buffer
    }
}, {timestamps:true});

userSchema.virtual("blogs",{
    ref: "Blog",
    localField: "_id",
    foreignField: "user"
});

userSchema.methods.toJSON = function(){

    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.token;

    return userObj;

}

userSchema.methods.createToken = async function(){

    const user = this;

    const token = await jwt.sign({_id: user._id.toString() }, process.env.JWT_PRIVATE_TOKEN);

    user.token = token;
    
    await user.save();
    
    return token; 

}


userSchema.statics.login = async function(email, password){
   
    const user = await User.findOne({email});
    
    if(!user){
        throw new Error("Login failed!");
    }

    const isMatch = await bcrpyt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Login failed!");
    }

    return user;
}


userSchema.pre("save", async function(next) {
    const user = this;

    
    

    if(user.isModified("password")){
        user.password = await bcrpyt.hash(user.password, 8);
    }

    next();

})

const User = mongoose.model("User", userSchema);

module.exports = User;