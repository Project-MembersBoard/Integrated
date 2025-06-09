import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './UserInfoDetail.css';

const URL = process.env.REACT_APP_API_URL;

export default function UserInfoDetail() {

    const navigate = useNavigate();

    const [postlist,setPostList] = useState([]); // 게시물 리스트 저장용
    const [userdata, setUserData] = useState({id:"",userid:"",name:"",email:"",birth:"",gender:"",mobile:"",created:"",recentlogin:""}); // 유저 정보 가지고 와서 저장용

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = postlist.slice(indexOfFirstItem, indexOfLastItem);

    const [selectedId, setSelectedId] = useState(null);

    // 페이지 변경 함수
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (indexOfLastItem < postlist.length) setCurrentPage(currentPage + 1);
    };

    const doSelect = (e) => {
        setSelectedId(e.id);
    };

    const goHome = (e) => {
        navigate('/');
    };

    const GetUserData = async (e) => {
    
        try {

            const response = await fetch(`${URL}/listprint/getuserdata`,
                {
                method:"Post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({}),
                credentials:"include",
                }
            );
    
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                const realdata = data[0];
                const birth = realdata.birth;
                const formattedBirth = `${birth.slice(0, 4)}.${birth.slice(4, 6)}.${birth.slice(6, 8)}`;
                setUserData(realdata);
                setUserData({
                    ...realdata,
                    birth: formattedBirth
                });
            };

        } catch(error) {
            alert(error.message);
        }

    };

    const GetBoardData = async (e) => {
    
        try {

            const response = await fetch(`${URL}/listprint/getBoardList`,
                {
                method:"Post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({}),
                credentials:"include",
                }
            );
    
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                setPostList(data);
            };

        } catch(error) {
            alert(error.message);
        }

    };

    useEffect(() => {
        GetUserData();
        GetBoardData();
    },[]);

    const exitTab = () =>{
        window.close();  
    };

 
    return(

        <div className="UserInfoDetailEntireDiv">

            <p className="UserInfoDetailHeader" onClick={goHome}>Super Board</p>

            <div className="UserInfoDetailPrintDiv">

                <p className="UserInfoDetailPrintHeader">유저 정보</p>

                <table className="UserInfoDetailTableTop">

                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>생일</th>
                            <th>성별</th>
                            <th>모바일번호</th>
                            <th>가입 날짜</th>
                            <th>최근 로그인날짜</th>
                            <th>상태</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{userdata.id}</td>
                            <td>{userdata.userid}</td>
                            <td>{userdata.name}</td>
                            <td>{userdata.email}</td>
                            <td>{userdata.birth}</td>
                            <td>{userdata.gender}</td>
                            <td>{userdata.mobile}</td>
                            <td>{userdata.created}</td>
                            <td>{userdata.recentlogin}</td>
                            <td>{userdata.status}</td>
                        </tr>
                    </tbody>

                </table>

                <p className="UserInfoDetailPrintMiddle">유저 게시물 정보</p>

                <table className="UserInfoDetailPrintTableBotton">

                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>카테고리</th>
                            <th>태그</th>
                            <th>조회수</th>
                            <th>좋아요</th>
                            <th>작성 시각</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((x) => (
                            <tr
                                key={x.id}
                                className={selectedId === x.id ? "UserInfoDetailRowSelected" : ""}
                                onClick={() => doSelect({ id:x.id })}
                            >
                                <td id={x.id} style={{ width: '3%' }} className="UserInfoDetailTabletdid" >{x.id}</td>
                                <td id={x.id} style={{ width: '15%' }} className="UserInfoDetailTabletdtitle">{x.title}</td>
                                <td id={x.id} style={{ width: '5%' }} className="UserInfoDetailTabletdwriter">{x.writer}</td>
                                <td id={x.id} style={{ width: '7%' }} className="UserInfoDetailTabletdcategory">{x.category}</td>
                                <td id={x.id} style={{ width: '5%' }} className="UserInfoDetailTabletdtag">{x.tag}</td>
                                <td id={x.id} style={{ width: '5%' }} className="UserInfoDetailTabletdhit">{x.hit}</td>
                                <td id={x.id} style={{ width: '5%' }} className="UserInfoDetailTabletdliked">{x.liked}</td>
                                <td id={x.id} className="UserInfoDetailTabletdcreated">{x.created}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                <div className="UserInfoDetailPagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="UserInfoDetailBtnLeft">이전 페이지</button>
                    <button onClick={handleNextPage} disabled={indexOfLastItem >= postlist.length} className="UserInfoDetailBtnRight">다음 페이지</button>
                </div>

            </div>

            <input type="button" className="UserInfoDetailFooterBtn" onClick={exitTab} value="탭 닫기" />

        </div>

    );

}