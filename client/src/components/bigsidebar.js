import Wrapper from '../assets/wrappers/BigSidebar'
import NavLinks from './navlinks'
import Logo from './logo'
import { useAppContext } from '../context/appContext'

const BigSidebar = () => {
    const {showSidebar,toggleSidebar} = useAppContext()
    return <Wrapper>
        <div className={showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'}>
            <div className="content">
                <header>
                    <Logo/>
                </header>
                <NavLinks toggleSidebar={toggleSidebar}/>
            </div> 
        </div>
    </Wrapper>
}

export default BigSidebar

