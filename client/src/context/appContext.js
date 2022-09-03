import React, {useContext, useReducer, useEffect } from 'react'
import reducer from './reducer'
import { 
    DISPLAY_ALERT, 
    CLEAR_ALERT, 
    REGISTER_USER_BEGIN, 
    REGISTER_USER_SUCCESS, 
    REGISTER_USER_ERROR, 
    LOGIN_USER_BEGIN, 
    LOGIN_USER_SUCCESS, 
    LOGIN_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    // GET_JOBS_ERROR
    DELETE_JOB_BEGIN,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS
} from './actions'
import axios from 'axios'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

const initialState = {
    loading : false,
    showAlert : false,
    alertText : '',
    alertType : '',
    user: user ? JSON.parse(user) : null,
    token : token,
    userLocation : userLocation || '',
    showSidebar : false,
    isEditing : false,
    editJobId : '',
    position: '',
    company : '',
    jobLocation : userLocation || '',
    jobTypeOptions : [
        'full-time',
        'part-time',
        'remote',''
    ],
    jobType : 'full-time',
    statusOptions : [
        'interview',
        'declined',
        'pending'
    ],
    status : 'pending',
    jobs : [],
    totalJobs : 0,
    numPages : 1,
    page : 1,
    stats : {},
    monthlyApplications : [],
    search : '',
    searchStatus : 'all',
    searchType : 'all',
    sort : 'latest',
    sortOptions : ['latest', 'oldest', 'a-z', 'z-a']
}

const AppContext = React.createContext()

const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer,initialState)
    
    //Setup axios default headers
    // axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
    const authFetch = axios.create({
        baseURL : '/api/v1/',
        // headers : {
        //     Authorization : `Bearer ${state.token}`
        // }
    })

    //Setup headers for requests using interceptors
    authFetch.interceptors.request.use((config)=>{
        config.headers.common['Authorization'] = `Bearer ${state.token}`
        return config
    },(err)=>{
        return Promise.reject(err)
    })

    //Setup headers for responses using interceptors
    authFetch.interceptors.response.use(
    (response)=>{
        return response
    },
    (err)=>{
        console.error(err.response)
       
        if(err.response.status === 401){
            console.log("Auth Error")
            logoutUser()
        }

        return Promise.reject(err)
    }
    )

    

    const displayAlert = () => {
        dispatch({type : DISPLAY_ALERT})
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(()=>{
            dispatch({type: CLEAR_ALERT})
        },3000)
    }

    const addUserToLocalStorage = ({user,token,location}) => {
        localStorage.setItem('user',JSON.stringify(user))
        localStorage.setItem('token',token)
        localStorage.setItm('location',location)
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('location')
    }

    const registerUser = async (currentUser) => {
        dispatch({type : REGISTER_USER_BEGIN})
        try{
            const response = await axios.post('/api/v1/auth/register',currentUser)

            console.log(response)

            const { user, token, location } = response.data

            dispatch({
                type : REGISTER_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location
                }
            })

            //local storage
            addUserToLocalStorage({user,token,location})
        }catch(err){
            console.log(err.response)
            dispatch({
                type : REGISTER_USER_ERROR,
                payload : {
                    msg : err.response.data.msg
                }
            })
        }
        clearAlert()
    }

    const loginUser = async (currentUser) => {
        console.log(currentUser)
        dispatch({type : LOGIN_USER_BEGIN})
        try{
            const response = await axios.post('/api/v1/auth/login',currentUser)

            console.log(response)

            const { user, token, location } = response.data

            dispatch({
                type : LOGIN_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location
                }
            })

            //local storage
            addUserToLocalStorage({user,token,location})
        }catch(err){
            console.log(err.response)
            dispatch({
                type : LOGIN_USER_ERROR,
                payload : {
                    msg : err.response.data.msg
                }
            })
        }
        clearAlert()
    }

    const toggleSidebar = () => {
        dispatch({
            type : TOGGLE_SIDEBAR
        })
    }

    const logoutUser = () => {
        dispatch({
            type : LOGOUT_USER
        })

        removeUserFromLocalStorage()
    }
    
    const updateUser = async (currentUser) => {
        console.log(currentUser)
        dispatch({
            type : UPDATE_USER_BEGIN
        })
        try{
            const { data }  = await authFetch.patch('/auth/updateUser', currentUser)
            // console.log(data)
            const { user, location, token } = data
            dispatch({
                type : UPDATE_USER_SUCCESS,
                payload : {
                    user,
                    location,
                    token
                }
            })
            addUserToLocalStorage({
                user,
                location,
                token
            })
        }catch(err){
            console.error(err)
            if(err.response.status !== 401){
                dispatch({
                    type : UPDATE_USER_ERROR,
                    payload : {
                        msg : err.response.data.msg
                    }
                })
            }
        }
        clearAlert()
    }

    const handleChange = ({name,value}) => {
        dispatch({
            type : HANDLE_CHANGE,
            payload : {
                name,
                value
            }
        })
    }

    const clearValues = () => {
        dispatch({
            type : CLEAR_VALUES
        })
    }

    const createJob = async () => {
        dispatch({
            type : CREATE_JOB_BEGIN
        })

        try{
            const { position, company, jobLocation, jobType, status } = state
            await authFetch.post('/jobs', {
                position,
                company,
                jobLocation,
                jobType,
                status
            })
            dispatch({
                type : CREATE_JOB_SUCCESS
            })
            dispatch({
                type : CLEAR_VALUES
            })
        }catch(err){
            console.error(err)
            if(err.response.status === 401) return
            dispatch({
                type : CREATE_JOB_ERROR,
                payload : {
                    msg : err.response.data.msg
                }
            })
        }
        clearAlert()
    }

    const getJobs = async () => {
        const { search, searchStatus, searchType, sort } = state
        let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}`

        if(search){
            url = url + `&search=${search}`
        }

        dispatch({
            type : GET_JOBS_BEGIN
        })

        try{
            const { data } = await authFetch(url)
            const {jobs, totalJobs, numPages } = data

            dispatch({
                type : GET_JOBS_SUCCESS,
                payload : {
                    jobs,
                    totalJobs,
                    numPages
                }
            })
        }catch(err){
            console.error(err.response)
            // logoutUser()
        }
        //If there are any alerts showing, hide them
        clearAlert()
    }


    // useEffect(()=>{
    //     getJobs()
    // },[getJobs])

    const setEditJob = (id) => {
        // console.log(`set edit job : ${id}`)
        dispatch({
            type : SET_EDIT_JOB,
            payload : {
                id
            }
        })
    }

    const editJob = async () => {
        console.log('edit job')
        dispatch({
            type : EDIT_JOB_BEGIN,
        })

        try{
            const { 
                position, 
                company, 
                jobLocation, 
                jobType, 
                status 
            } = state

            await authFetch.patch(`/jobs/${state.editJobId}`,{
                company,
                position,
                jobLocation,
                jobType,
                status
            })

            dispatch({
                type :  EDIT_JOB_SUCCESS
            })

            //Clear the form
            dispatch({
                type : CLEAR_VALUES
            })


        }catch(err){
            if(err.response.status === 401) return
            dispatch({
                type : EDIT_JOB_ERROR,
                payload: {
                    msg : err.response.data.msg
                }
            })
        }
        clearAlert()
    }

    const deleteJob = async (jobId) => {
        // console.log(`delete job ${id}`)
        dispatch({
            type : DELETE_JOB_BEGIN
        })

        try{
            await authFetch.delete(`/jobs/${jobId}`)
            getJobs()
        }catch(err){
            console.error(err.response)
            // logoutUser()
        }
    }

    const showStats = async () => {
        dispatch({
            type : SHOW_STATS_BEGIN
        })

        try{
            const {data} = await authFetch('/jobs/stats')
            dispatch({
                type : SHOW_STATS_SUCCESS,
                payload : {
                    stats : data.defaultStats,
                    monthlyApplications : data.monthlyApplications
                }
            })
        }catch(err){
            console.error(err.response)
            logoutUser();
        }
    }

    const clearFilters = () => {
        console.log("clear filters")
        dispatch({
            type : CLEAR_FILTERS
        })
    }

    return <AppContext.Provider value={{
        ...state,
        displayAlert,
        registerUser, 
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser, 
        handleChange,
        clearValues, 
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters
    }}>
        {children}
    </AppContext.Provider>
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext}