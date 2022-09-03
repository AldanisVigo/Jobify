import { Outlet } from 'react-router-dom'
import Wrapper from '../../assets/wrappers/SharedLayout'
import { NavBar, SmallSidebar, BigSidebar } from '../../components'
const SharedLayout = () => {
    return <Wrapper>
        <main className="dashboard">
            <SmallSidebar/>
            <BigSidebar/>
            <div>
                <NavBar/>
                <div className="dashboard-page">
                    <Outlet/>
                </div>
            </div>
        </main>
    </Wrapper>
}

export default SharedLayout