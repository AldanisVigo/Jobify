import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
    name :  { 
        type : String , 
        required: [true, 'Please provide name'], 
        minLength: 3, 
        maxLength: 20, 
        trim: true
    },
    email :  { 
        type : String , 
        required: [true, 'Please provide email'], 
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
        unique: true
    },
    password :  { 
        type : String , 
        required: [true, 'Please provide password'], 
        minLength: 6, 
        select : false
    },
    lastName :  { 
        type : String , 
        minLength: 3, 
        maxLength: 20, 
        trim: true,
        default : 'Last Name'
    },
    location :  { 
        type : String , 
        maxLength: 20, 
        trim: true,
        default : 'my city'
    },

})

UserSchema.pre('save',async function(){
    // console.log(this.password)
    // console.log(this.modifiedPaths())
    if(!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({userId : this._id},process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePasswords = async function(candiatePassword){
    const isMatch = await bcrypt.compare(candiatePassword,this.password)
    return isMatch
}

export default mongoose.model("User",UserSchema)