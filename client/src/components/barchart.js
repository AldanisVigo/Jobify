import {
    BarChart as BChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

const BarChart = ({data}) => {
    return <ResponsiveContainer width="100%" height={300}>
        <BChart
            data = {data}
            margin = {{
                top : 50
            }}
        >
            <CartesianGrid strokeDasharray='3 3'/>
            <XAxis dataKey='date'/>
            <YAxis allowDecimals = { false }/>
            <Tooltip/>
            <Bar dataKey='count' fill='#2cb1bc' barSize={75}/>
        </BChart>

    </ResponsiveContainer>
}

export default BarChart