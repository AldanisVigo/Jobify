
import StatsItem from "./statsitem"
import { useAppContext } from "../context/appContext"
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from "react-icons/fa"
import Wrapper from '../assets/wrappers/StatsContainer'

const StatsContainer = () => {
    const { stats } = useAppContext()

    const defaultStats = [
        {
            title: 'pending applications',
            count : stats.pending || 0,
            icon : <FaSuitcaseRolling/>,
            color: '#e9b949',
            bcg: '#fcefc7'
        },
        {
            title: 'interviews scheduled',
            count : stats.interview || 0,
            icon : <FaCalendarCheck/>,
            color: '#647acb',
            bcg: '#e0e8f9'
        },
        {
            title: 'applications declined',
            count : stats.declined || 0,
            icon : <FaBug/>,
            color: '#d66a6a',
            bcg: '#ffeeee'
        },
    ]

    return <Wrapper>
        {defaultStats && defaultStats.map((item,index)=><StatsItem key={index} {...item}/>)}
    </Wrapper>
}

export default StatsContainer