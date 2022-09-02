import User from "../models/User.js"
import StatusCodes from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from "../errors/index.js"

const register = async (req,res,next) => {

    const {name,email,password } = req.body

    if(!name || !email || !password){
        throw new BadRequestError("Please provide all values")
    }

    const userAlreadyExists = await User.findOne({email})
    if(userAlreadyExists){
        throw new BadRequestError("Email already in use.")
    }

    const user = await User.create({name,email,password})

    const token = user.createJWT()

    res.status(StatusCodes.OK).json({
        user : {
            email : user.email,
            lastName : user.lastName,
            location: user.location,
            name: user.name
        },
        token,
        location: user.location
    })
}

const login = async (req,res,next) => {
    const { email, password } = req.body

    console.log("REQUEST BODY: ")
    console.log(req.body)
    
    if(!email || !password){
        throw new BadRequestError("Please provide all values")
    }

    const user = await User.findOne({
        email
    }).select('+password')

    if(!user){
        throw new UnauthenticatedError("Invalid credentials")
    }

    const isPasswordCorrect = await user.comparePasswords(password)

    if(!isPasswordCorrect){
        throw new UnauthenticatedError("The password is not correct")
    }

    const token = user.createJWT()
    user.password = undefined
    res.status(StatusCodes.OK).json({
        user,
        token,
        location : user.userLocation
    })
}

const updateUser = async (req,res) => {
    const { email, name, lastName, location } = req.body
    
    if(!email || !name || !lastName || !location){
        throw new BadRequestError("Please provide all the values")
    }

    const user = await User.findOne({
        _id : req.user.userId
    })

    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    await user.save()

    const token = user.createJWT()

    res.status(StatusCodes.OK).json({
        user,
        token,
        location: user.location
    })
}

export { register, login, updateUser }