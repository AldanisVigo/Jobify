import Job from "../models/Job.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/index.js"
import checkPermissions from "../utils/checkPermissions.js"
import CustomAPIError from "../errors/custom-error.js"

const createJob = async (req,res) => {
    const { position, company } = req.body

    if(!position || !company){
        throw new BadRequestError("Please provide all values")
    }   

    req.body.createdBy = req.user.userId

    const job = await Job.create(req.body)

    res.status(StatusCodes.CREATED).json({ job })


    res.send('create job')
}

const deleteJob = async (req,res) => {
    // res.send('delete job')
    const { id : jobId }  = req.params

    const job = await Job.findOne({
        _id : jobId
    })

    if(!job){
        throw new NotFoundError(`No job with id : ${jobId}`)
    }

    checkPermissions(req.user, job.createdBy)

    await job.remove()

    res.status(StatusCodes.OK).json({
        msg : 'Success! Job removed!'
    })
}

const getAllJobs = async (req,res) => {
    const jobs = await Job.find({
        createdBy : req.user.userId
    })

    
    res.status(StatusCodes.OK).json({jobs, totalJobs: jobs.length, numPages : 1 })
}

const updateJob = async (req,res) => {
    const {id:jobId} = req.params
    const { company, position, jobLocation } = req.body
    
    if(!position || !company){
        throw new BadRequestError('Please provide all values')
    }

    const job = await Job.findOne({_id : jobId })

    if(!job){
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    //check for permissions
    checkPermissions(req.user, job.createdBy)

    const updatedJob = await Job.findOneAndUpdate({
        _id : jobId
    }, req.body, {
        new : true,
        runValidators : true
    })

    //alternative approach
    // job.position = position
    // job.company = company
    // job.jobLocation = jobLocation

    // await job.save()

    res.status(StatusCodes.OK).json({
        updatedJob
    })
}

const showStats = async (req,res) => {
    res.send('showStats')
}

export {createJob, deleteJob, getAllJobs, updateJob, showStats }