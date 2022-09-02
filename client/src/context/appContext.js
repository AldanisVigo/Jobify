import React, {useContext, useReducer } from 'react'
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
    CLEAR_VALUES
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
    status : 'pending'
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

    return <AppContext.Provider value={{...state, displayAlert,registerUser, loginUser,toggleSidebar,logoutUser,updateUser, handleChange,clearValues}}>
        {children}
    </AppContext.Provider>
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext}