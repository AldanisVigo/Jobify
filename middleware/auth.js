import { UnauthenticatedError } from "../errors/index.js"
import jwt from 'jsonwebtoken'
const auth = async (req,res,next) => {
    const headers = req.headers
    const authHeader = req.headers.authorization
    // console.log(headers)
    // console.log(authHeader)
    // console.log("Authenticate user")
    if(!authHeader || !authHeader.startsWith("Bearer")){
        throw new UnauthenticatedError("Authentication Invalid")
    }

    const token = authHeader.split(' ')[1]

    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        // console.log(payload)
        req.user = { userId : payload.userId }
        next()
    }catch(err){
    
    }
}

export default auth