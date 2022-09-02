import { FormRow, FormRowSelect, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddJob = () => {
    const {
        showAlert,
        displayAlert,
        position,
        company,
        jobLocation,
        jobType,
        jobTypeOptions,
        status,
        statusOptions,
        isEditing,
        handleChange,
        clearValues,
        user,
        isLoading,
        createJob
    } = useAppContext()
    
    const handleJobInput = e => {
        const name = e.target.name
        const value = e.target.value
        console.log(`${name} : ${value}`)
        handleChange({
            name,
            value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        if(!position || !company || !jobLocation){
            displayAlert()
            return
        }

        if(isEditing){
            //eventually editJob()

            return
        }

        console.log("Create Job")
        createJob()
    }

    return <Wrapper>
        <form className='form'>
            <h3>{isEditing ? 'Edit Job' : 'Add Job'}</h3>
            {showAlert && <Alert/>}
            <div className="form-center">
                <FormRow 
                    type="text" 
                    name="position" 
                    value={position} 
                    handleChange={handleJobInput}
                />
                <FormRow 
                    type="text" 
                    name="company" 
                    value={company} 
                    handleChange={handleJobInput}
                />
                <FormRow 
                    type="text" 
                    name="jobLocation" 
                    labelText="Job Location"
                    value={jobLocation || user.location} 
                    handleChange={handleJobInput}
                />

                <FormRowSelect
                    name="status"
                    value={status}
                    handleChange={handleJobInput}
                    list={statusOptions}
                />

                <FormRowSelect
                    name="jobType"
                    labelText="Job Type"
                    value={jobType}
                    handleChange={handleJobInput}
                    list={jobTypeOptions}

                />

                <div className="btn-container">
                    <button type="submit" className="btn btn-block submit-btn" disabled={isLoading} onClick={handleSubmit}>
                        Submit
                    </button>
                    <button className="btn btn-block clear-btn" onClick={(e)=>{
                        e.preventDefault()
                        clearValues()
                    }}>
                        Clear
                    </button>
                </div>



            </div>
        </form>
    </Wrapper>
}

export default AddJob