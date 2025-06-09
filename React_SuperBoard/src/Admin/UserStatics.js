import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MonthlyStaticsGraph from "../components/MonthlyStaticsGraph";

import './UserStatics.css';

const URL = process.env.REACT_APP_API_URL;

export default function UserStatics() {

    const navigate = useNavigate();

    const [statics, setStatics] = useState({
        dailyMemberCount:"",
        monthlyMemberCount:"",
        yearlyMemberCount:"",
        dailyPostCount:"",
        monthlyPostCount:"",
        yearlyPostCount:"",
        dailyMaxView:"",
        monthlyMaxView:"",
        yearlyMaxView:"",
        dailyMaxLike:"",
        monthlyMaxLike:"",
        yearlyMaxLike:""
    });

    const [mStatics, setMstatics] = useState([]);

    const [logs, setLogs] = useState({
        signup: "",
        login: ""
    });

    const getLogs = async (e) => {

        try {

            const response = await fetch(`${URL}/statics/logs`,
                {
                method:"Post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({}),
                credentials:"include",
                }
            );
    
            if(response.ok) {
                const data = await response.json();
                setLogs(data);
            };

        } catch(error) {
            alert(error.message);
        }

    };

    const goHome = (e) => {
        console.log(statics);
        navigate('/');
    };
    
    // 2025_04_30 10:08 추가
    const [selectedDate, setSelectedDate] = useState(""); // select value저장용 state

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);  // 선택된 상태 값 업데이트
    };

    const getYearStatics = async (year) => {

        try {
            const response = await fetch(`${URL}/etcstatics/getStaticsYearData`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ year: year }),  // 선택된 연도 전송
                    credentials: "include",
                }
            );
    
            if (response.ok) {
                const data = await response.json();
                const chartData = data.map((item, index) => ({
                    month: `${index + 1}월`,
                    memberCount: item.monthlyMemberCount,
                    postCount: item.monthlyPostCount,
                    mostView: item.maxViewPostTitle,
                    mostLike: item.maxLikePostTitle
                  }));
                setMstatics(chartData);
            }
    
        } catch (error) {
            alert(error.message);
        }

    };

    useEffect(() => {
        getYearStatics(selectedDate); // 선택된 상태에 따라 fetch 호출
    }, [selectedDate]);

    return (
        
        <div className="UserStaticsEntireDiv">

            <p className="UserStaticsHeaderP" onClick={goHome}>Super Board</p>

            <select value={selectedDate} className="UserStaticsSelectValue" onChange={handleDateChange}>
                <option value="">선택하세요</option>
                <option value="2024">2024년</option>
                <option value="2025">2025년</option>
            </select>

            {mStatics.length > 0 && (
                <MonthlyStaticsGraph data={mStatics} />
            )}

            <div className="UserStaticsPrintTableDiv">

                <table className="UserStaticsPrintTable">
                    
                    <thead>
                        <tr>
                            <th></th>
                            <th>최고 조회수 게시물</th>
                            <th>최고 좋아요 게시물</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mStatics.map((item, index) => (
                            <tr key={index}>
                                <td>{item.month}</td>
                                <td>{item.mostView}</td>
                                <td>{item.mostLike}</td>
                            </tr>
                        ))}
                        {/* <tr>
                            <td>일별 통계</td>
                            <td>{statics.dailyMemberCount}</td>
                            <td>{statics.dailyPostCount}</td>
                            <td>{statics.dailyMaxView}</td>
                            <td>{statics.dailyMaxLike}</td>
                        </tr>
                        <tr>
                            <td>월별 통계</td>
                            <td>{statics.monthlyMemberCount}</td>
                            <td>{statics.monthlyPostCount}</td>
                            <td>{statics.monthlyMaxView}</td>
                            <td>{statics.monthlyMaxLike}</td>
                        </tr>
                        <tr>
                            <td>연도별 통계</td>
                            <td>{statics.yearlyMemberCount}</td>
                            <td>{statics.yearlyPostCount}</td>
                            <td>{statics.yearlyMaxView}</td>
                            <td>{statics.yearlyMaxLike}</td>
                        </tr> */}
                    </tbody>
                    
                </table>

            </div>

        </div>

    );

}