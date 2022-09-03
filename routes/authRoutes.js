import { register, login, updateUser } from '../controllers/authController.js'
import express from 'express'
import authenticateUser from '../middleware/auth.js'

//request rate limiting per IP address
import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000, //15 min
    max : 10, //Limit each ip to 10 requests per 15min
    standardHeaders : true, //return rate limit info
    legacyHeaders : false, // Disable the `X-RateLimit-*` headers
    message : "Too many requests from this IP address, please try again after 15 minutes."
})

const router = express.Router()

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/updateUser').patch(authenticateUser,updateUser)

export default router