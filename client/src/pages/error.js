import { Link } from "react-router-dom"
import img from '../assets/images/not-found.svg'
import Wrapper from '../assets/wrappers/ErrorPage'

const Error = () => {
    return <Wrapper className="full-page">
        <div>
            <img src={img} alt="not-found"/>
            <h3>Page Not Found</h3>
            <p>The page you were trying to find does not exist. Please return to the Dashboard.</p>
            <Link to="/">Back to Dashboard</Link>
        </div>
    </Wrapper>
}

export default Error