import { useState, useEffect } from 'react'
import Wrapper from '../assets/wrappers/RegisterPage'
import { FormRow, Logo, Alert } from '../components'
import { useAppContext } from '../context/appContext'
import { useNavigate } from 'react-router-dom'

const initialState = {
    name : '',
    email: '',
    password : '',
    isMember:  true,
}

const Register = () => {
    const [values,setValues] = useState(initialState)

    const {isLoading, showAlert, displayAlert, registerUser,user, loginUser} = useAppContext()

    const toggleMember = () => {
        setValues({...values, isMember : !values.isMember})
    }

    const handleChange = (e) => {
        setValues({...values,[e.target.name] : e.target.value})
        console.log(e.target)
    }

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const {name, email, password, isMember } = values
        if(!email || !password || (!isMember && !name)){
            displayAlert()
            return
        } 

        const currentUser = {name,email,password}

        if(isMember){
            console.log("already a member")
            loginUser(currentUser)
        }else{
            registerUser(currentUser)
        }

        console.log(values)
    }

    useEffect(()=>{
        if(user){
            setTimeout(()=>{
                navigate('/')
            },3000)
        }
    },[user,navigate])

    return <Wrapper className="full-page">
        <form className="form" onSubmit={handleSubmit}>
            <Logo/>
            <h3>{values.isMember ? 'Login' : 'Register'}</h3>
            {showAlert && <Alert/>}
            {!values.isMember && (
                <FormRow type="text" name="name" value={values.name} handleChange={handleChange} />
            )}
            {/* name input */}
            <FormRow type="email" name="email" value={values.email} handleChange={handleChange} />
            <FormRow type="password" name="password" value={values.password} handleChange={handleChange} />
            <button type="submit" className="btn btn-block" disabled={isLoading}>Submit</button>
            <p>
                {
                    values.isMember ? 'Not a member yet?' : 'Already a member?'
                }
                <button type="button" onClick={toggleMember} className="member-btn">
                    {values.isMember ? 'Register' : 'Login'}
                </button>
            </p>
        </form>
    </Wrapper>
}

export default Register