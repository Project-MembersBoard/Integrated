import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function MonthlyStaticsGraph({ data }) {
    
    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="memberCount" stroke="#8884d8" name="가입자 수" />
            <Line type="monotone" dataKey="postCount" stroke="#82ca9d" name="게시물 수" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
}