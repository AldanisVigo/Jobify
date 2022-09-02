import main from '../assets/images/main.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import {Logo} from '../components'
import { Link } from 'react-router-dom'
const Landing = () => {
    return <Wrapper>
        <nav>
            <Logo/>
        </nav>
        <div className="container page">
            {/* info */}
            <div className="info">
                <h1>
                    Event <span>organization</span> app
                </h1> 
                <p>
                    I'm baby bicycle rights ugh gluten-free selfies kinfolk. Cliche four dollar toast irony literally umami sustainable bodega boys forage intelligentsia copper mug. Glossier helvetica sustainable synth food truck ramps bicycle rights migas, gochujang shaman big mood praxis.
                </p>
                <Link to="/register">
                    <button className="btn btn-hero">Login / Register</button>
                </Link>
            </div>
            {/* image */}
            <img src={main} alt="job hunt" className="img main-img"/>
        </div>
    </Wrapper>
}

export default Landing