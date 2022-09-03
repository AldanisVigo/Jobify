import { useAppContext } from "../context/appContext"
import { useEffect } from "react"
import Loading from './loading'
import Job from "./job"
import Wrapper from '../assets/wrappers/JobsContainer'

const JobsContainer = () => {
    const { 
        getJobs, 
        jobs, 
        isLoading, 
        page, 
        totalJobs,
        search,
        searchStatus,
        searchType,
        sort
    } = useAppContext()


    useEffect(()=>{
        getJobs()
    },[search, searchStatus, searchType, sort])

    if(isLoading){
        return <div>
            <Loading center/>
        </div>
    }
    
    if(jobs.length === 0){
        return <Wrapper><h2>No jobs to display...</h2></Wrapper>
    }
    
    return <Wrapper>
        <h5>{totalJobs} job{jobs.length > 1 && 's'} found</h5>
        <div className="jobs">
            {jobs && jobs.map((job)=>{
                return <Job key={job._id} {...job}/>
            })}
        </div>

        {/* pagination buttons */}
    </Wrapper>
}

export default JobsContainer