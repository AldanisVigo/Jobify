import morgan from 'morgan'
import dotenv from 'dotenv'
//Initialize the dotenv configuration
dotenv.config()
import 'express-async-errors'

import express from 'express'
const app = express()

//db and authenticateUser
import connectDB from './db/connect.js'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'


//secure server
import helmet from 'helmet' //clean / secure headers
import xss from 'xss-clean' //sanitize user input in get and post requests to prevent cross site scripting
import mongoSanitize from 'express-mongo-sanitize' //Lock down mongodb database

// import cors from 'cors'

//routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

//middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'))
}

const __dirname = dirname(fileURLToPath(import.meta.url))

//Setup access to static assets
app.use(express.static(path.resolve(__dirname,'./client/build')))

// app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize()) //prevent mongodb operator injection

// // console.log("Concurrently is working")
// app.get('/',(req,res,next)=>{
//     // throw new /("error")
//     res.json({
//         msg : "Welcome!"
//     })
// })

// app.get('/api/v1/',(req,res)=>{
//     res.json({
//         msg : "API"
//     })
// })


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.get('*',(req,res) => res.sendFile(path.resolve(__dirname,'./client/build','index.html')))

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000



const start = async () => {
    try{
        await connectDB(process.env.MONGODB_URL)
        app.listen(port,()=>{
            console.log("Node server started on port " + port)
        })
    }catch(err){
        console.error(err)
    }
}

start()