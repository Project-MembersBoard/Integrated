import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './UserInfoSearch.css';

const URL = process.env.REACT_APP_API_URL;

export default function UserInfoPrint(){

    const navigate = useNavigate();

    const [printlist,setPrintList] = useState([]); // 처음 렌더링 되었을 때 가지고 올 리스트들을 저장해놓을 state
    const [senddata, setSendData] = useState({userid:"", email:""});

    const [filter, setFilter] = useState({value:""});

    const [selectedId, setSelectedId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = printlist.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 함수
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (indexOfLastItem < printlist.length) setCurrentPage(currentPage + 1);
    };

    const GetRenderData = async (e) => {

        try {

            const response = await fetch(`${URL}/listprint/getuserlist`,
                {
                method:"Post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({}),
                credentials:"include",
                }
            );
    
            if(response.ok) {
                const data = await response.json();
                setPrintList(data);
                
                // 체크박스 상태 초기화
                const initialChecked = {};
                data.forEach(item => { initialChecked[item.id] = false; });
                setCheckedItems(initialChecked);
            };

        } catch(error) {
            alert(error.message);
        }

    };

    useEffect(() => {
        GetRenderData();
    },[]);

    const goHome = (e) => {
        navigate('/');
    };

    const doSelect = (e) => {
        setSendData({userid:e.userid, email:e.email});
        setSelectedId(e.id);
    };

    const goViewDetail = async (id) => {

        try {

            const response = await fetch(`${URL}/listprint/setSession`,
                {
                method:"Post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({id:id}),
                credentials:"include",
                }
            );
    
            if(response.ok) {
                window.open(`/userinfodetail`, "_blank");
            };

        } catch(error) {
            alert(error.message);
        }
    };

    const inputFilterValue = (e) => {
        let {name, value} = e.target;
        setFilter((prev) => ({...prev, [name]:value}));
    };

    // 리스트를 가지고 와서 setPrintList에 집어 넣기
    const GetFilterInfo = async (e) => {

        try {

            const response = await fetch(`${URL}/listprint/getFilterInfo`,
                {
                method:"Post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(filter),
                credentials:"include",
                }
            );
    
            if(response.ok) {
                const result = await response.json();
                setPrintList(result);

                const initialChecked = {};
                result.forEach(item => { initialChecked[item.id] = false; });
                setCheckedItems(initialChecked);
            };

        } catch(error) {
            alert(error.message);
        }

    };

    useEffect(() => {
        GetFilterInfo();
    },[filter]);

     // 체크박스 상태 저장용 (id -> true/false)
        const [checkedItems, setCheckedItems] = useState({});
    
        const [selectedStatus, setSelectedStatus] = useState(""); // select value저장용 state
    
        // 개별 체크박스 변경 핸들러
        const handleCheckboxChange = (id) => {
            setCheckedItems(prev => ({...prev, [id]: !prev[id]}));
        };
    
        // 모두 선택 버튼 클릭 시
        const handleCheckAll = () => {
            const updated = {};
            currentItems.forEach(item => {
                updated[item.id] = true;
            });
            setCheckedItems(prev => ({...prev, ...updated}));
        };
    
        // 모두 취소 버튼 클릭 시
        const handleUncheckAll = () => {
            const updated = {};
            currentItems.forEach(item => {
                updated[item.id] = false;
            });
            setCheckedItems(prev => ({...prev, ...updated}));
        };
    
        const stopAccount = async () => {
            const selectedIds = Object.entries(checkedItems)
                .filter(([id, isChecked]) => isChecked)
                .map(([id]) => parseInt(id)); // 또는 그냥 id
        
            if (selectedIds.length === 0) {
                alert("정지시킬 사용자를 선택하세요.");
                return;
            }
        
            try {
                const response = await fetch(`${URL}/etc/stopAccounts`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids: selectedIds }),
                    credentials: "include",
                });
        
                if (response.ok) {
                    alert("선택한 사용자들을 정지시켰습니다.");
                    GetRenderData(); // 최신 목록 다시 가져오기
                } else {
                    alert("정지 실패");
                }
        
            } catch (error) {
                alert(error.message);
            }
        };
    
        const activateAccount = async () => {
            // 활성화할 사용자들의 id 가져오기 (체크된 항목만 필터링)
            const selectedIds = Object.keys(checkedItems)
                .filter(id => checkedItems[id])
                .map(id => parseInt(id));
        
            if (selectedIds.length === 0) {
                alert("활성화할 사용자를 선택해주세요.");
                return;
            }
        
            try {
                const response = await fetch(`${URL}/etc/activateAccounts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ ids: selectedIds }),
                    credentials: "include"
                });
        
                if (response.ok) {
                    alert("선택된 사용자들의 상태가 활성화되었습니다.");
                    GetRenderData();  // 활성화 후 사용자 리스트를 다시 불러옵니다.
                } else {
                    alert("활성화 중 오류가 발생했습니다.");
                }
            } catch (error) {
                alert("서버와의 통신에 실패했습니다.");
                console.error(error);
            }
        };
    
        const handleStatusChange = (e) => {
            setSelectedStatus(e.target.value);  // 선택된 상태 값 업데이트
          };
        
        // 선택된 상태에 따라 fetch 요청을 보내는 함수
        const fetchUserData = async (status) => {
    
            try {
                const response = await fetch(`${URL}/etc/filterUsers`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: status }),
                  });
    
                if (response.ok) {
                    const data = await response.json();
                    setPrintList(data); 
                } else {
                    console.error("Fetch failed");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
    
        };
    
        // 상태가 변경될 때마다 해당 상태에 맞는 데이터를 가져오는 useEffect
        useEffect(() => {
            if (selectedStatus) {
            fetchUserData(selectedStatus); // 선택된 상태에 따라 fetch 호출
            }
        }, [selectedStatus]); // selectedStatus가 변경될 때마다 실행
    

    return(

        <div className="UserInfoPrintEntireDiv">

            {/* 홈으로 가게 하는 p태그 */}
            <p className="UserInfoPrintHeaderP" onClick={goHome}>Super Board</p>

            {/* 전체적으로 요소들을 집어 넣을 div */}
            <div className="UserInfoPrintPrintDiv">

                <div className="UserInfoPrintHeaderDiv">

                    {/* span태그가 한줄에 다 나오게 */}
                    <span className="UserInfoPrintPrintHeader">
                        <p>회원 목록</p>
                    </span>

                    <span className="UserInfoPrintInputText">
                        <input type="text" name="value" placeholder="이름을 입력하세요" onChange={inputFilterValue} />
                    </span>

                </div>

                <div className="UserInfoPrintCheckBoxDiv">

                    <span className="UserInfoPrintCheckbox">
                        <input type="button" value="모두 선택" onClick={handleCheckAll} />
                    </span>

                    <span className="UserInfoPrintCheckbox">
                        <input type="button" value="모두 취소" onClick={handleUncheckAll} />
                    </span>

                    <span className="UserInfoFilterSelect">
                    <select className="UserInfoSelectClassname" value={selectedStatus} onChange={handleStatusChange}>
                        <option value="all">ㅡㅡㅡㅡ모두ㅡㅡㅡㅡ</option>
                        <option value="활성화">활성화</option>
                        <option value="정지">정지</option>
                    </select>
                    </span>

                </div>

                <table className="UserInfoPrintTable">

                    <thead>
                        <tr>
                            <th></th>
                            <th>번호</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>가입날짜</th>
                            <th>최근 로그인 날짜</th>
                            <th>상태</th>
                            <th>상세보기</th>
                        </tr>
                    </thead>

                     <tbody>

                        {currentItems.map((x) => (
                            <tr
                                key={x.id}
                                className={selectedId === x.id ? "UserInfoPrintRowSelected" : ""}
                                onClick={() => doSelect({ userid: x.userid, email: x.email, id: x.id })}
                            >
                                <td id={x.id}><input type="checkbox" checked={checkedItems[x.id] || false} onChange={() => handleCheckboxChange(x.id)} /></td>
                                <td id={x.id} className="UserInfoPrintTabletdid" >{x.id}</td>
                                <td id={x.id} className="UserInfoPrintTabletdname">{x.name}</td>
                                <td id={x.id} className="UserInfoPrintTabletdemail">{x.email}</td>
                                <td id={x.id} className="UserInfoPrintTabletdsignupdate">{x.created}</td>
                                <td id={x.id} className="UserInfoPrintTabletdrecentlogin">{x.recentlogin}</td>
                                <td id={x.id} className="UserInfoPrintTabletdrecentlogin">{x.status}</td>
                                <td id={x.id}><input type="button" className="UserInfoPrintTableBtn" onClick={() => goViewDetail(x.id)} value="상세보기" /></td>
                            </tr>
                        ))}

                    </tbody>

                </table>

                <div className="UserInfoPrintPagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="UserInfoPrintBtnLeft">이전 페이지</button>
                    <button onClick={handleNextPage} disabled={indexOfLastItem >= printlist.length} className="UserInfoPrintBtnRight">다음 페이지</button>
                </div>

            </div>
            
            <input type="button" className="UserInfoFooterBtn1" onClick={goHome} value="홈으로" />
            <input type="button" className="UserInfoFooterBtn2" onClick={stopAccount} value="정지" />
            <input type="button" className="UserInfoFooterBtn3" onClick={activateAccount} value="활성화" />

        </div>

    );

}