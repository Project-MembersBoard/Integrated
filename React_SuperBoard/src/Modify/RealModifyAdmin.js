import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import './RealModify.css';

const URL = process.env.REACT_APP_API_URL;
const Key = "aF9kL2pR8wXzT3Nh";

export default function RealModifyAdmin() {

    const navigate = useNavigate();

    // 마지막에 체크할 처음 서버쪽에서 보낸 값을 저장하는 용도의 state
    const [first, setFirst] = useState({userid:"", password:"", name:"", email:"", mobile:"", gender:"",birth:"",created:""});

    // 수정으로 보낼 값
    const [modifyvalue, setModifyValue] = useState({userid:"", password:"", name:"", email:"", mobile:"", gender:"",birth:"",created:""});

    // 새 비밀번호 용도
    const [newpw, setNewpw] = useState({npw:"", cpw:"",chpw:""});
 
    // 비밀번호 변경 창 띄우는 용도의 state
    const [showNewPasswordRow, setShowNewPasswordRow] = useState(false);

    // 수정할 때 사용할 state 혹여나 인증받고 바꿀까봐 4개가 다 true여야만 수정 실행
    const [availableid, setAvailableId] = useState(true);
    const [availablepw, setAvailablePw] = useState(true);
    const [availablemobile, setAvailableMobile] = useState(true);

    // 팝업창 띄우는 용도
    const [popup, setPopup] = useState(false);

    // 삭제 용도
    const [phrase, setPhrase] = useState({phrase:""});
    const sentence = `${modifyvalue.userid}/탈퇴하겠습니다`;

    const deletePhrase = (e) => {
        let {name, value} = e.target;
        setPhrase((prev) => ({...prev, [name]:value}));
    };

    const printModifyPassword = (e) => {
        e.preventDefault();
        setShowNewPasswordRow(true);
    };

    const goHome = (e) => {
        navigate('/');
    };

    const setValueId = (e) => {
        setAvailableId(false);
        let {name, value} = e.target;
        setModifyValue((prev) => ({...prev, [name]:value}));
        if(value === first.userid) {
            setAvailableId(true);
        }
    };

    const checkNewId = async (e) => {

        try {
            const response = await fetch(`${URL}/modify/checkId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id:modifyvalue.userid}),
                credentials: "include"
            });

            if(!response.ok) {
                throw new Error("서버 오류");
            }

            const result = await response.text();
            if (result === "") {
                setAvailableId(true);
                alert('사용 가능한 아이디입니다.');
            } else {
                setAvailableId(false);
                alert('이미 사용 중인 아이디입니다.');
                setModifyValue(prev => ({
                    ...prev,
                    userid:""
                }));
            }

        } catch(error) {
            alert(error.message);
        }

    };

    const setValueM = (e) => {
        setAvailableMobile(false);
        let {name, value} = e.target;
        setModifyValue((prev) => ({...prev, [name]:value}));
        if(value === first.mobile) {
            setAvailableMobile(true);
        }
    };

    const updateMobile = async (e) => {

        const regex = /^010\d{8}$/;
        const mobile = modifyvalue.mobile;

        if(mobile.trim() === '' || mobile.trim().length > 24 || mobile.trim().length < 11 ||
           /[ㄱ-ㅎㅏ-ㅣ]/.test(mobile) || /^[A-Za-z]+$/.test(mobile) || !/^[0-9-]+$/.test(mobile) ||
           !regex.test(mobile)) {
            alert("형식이 올바르지 않습니다.(-빼주세요)");
            return;
        }

        try {
            const response = await fetch(`${URL}/modify/checkMobile`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile: mobile }),
                credentials: "include"
            });
    
            if (!response.ok) throw new Error('서버 오류');
    
            const data = await response.text();
    
            if (data === "") {
                setAvailableMobile(true);
                alert('휴대폰번호: 사용 가능한 번호입니다.');
                setModifyValue(prev => ({
                    ...prev,
                    mobile: mobile
                }));
            } else {
                setAvailableMobile(false);
                alert('휴대폰번호: 이미 사용 중인 번호입니다.');
                return;
            }
        } catch (error) {
            alert(error.message); // ← 이 줄을 활성화하면 alert창으로 에러 표시 가능
            return;
        }

    }

    const currentPassword = (e) => {
        let {name, value} = e.target;
        setNewpw((prev) => ({...prev, [name]:value}));
    };

    const newPassword = (e) => {
        setAvailablePw(false);
        let {name, value} = e.target;
        setNewpw((prev) => ({...prev, [name]:value}));
        if(value === "") {
            setAvailablePw(true);
        }
    };

    const changePassword = (e) => {

        const pw = newpw.cpw;
        const npw = newpw.npw;
        const cpw = newpw.chpw;

        if(npw.trim() === '' || npw === Key || npw.trim().length > 16 
           || /[!@#$%^&*(),.?":{}|<>]/.test(npw) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(npw)) {
            alert("해당 비밀번호는 사용 불가능합니다.");
            return;
        }

        if(modifyvalue.password !== pw) {
            alert("비밀번호가 올바르지 않습니다.");
            return;
        }

        if(npw !== cpw) {
            alert("비밀번호가 같지 않습니다.");
            return;
        }

        alert("사용 가능한 비밀번호입니다");
        setModifyValue(prev => ({
            ...prev,
            password:npw
        }));

        setAvailablePw(true);

    };

    const resetPassword = (e) => {
        setNewpw({npw:"", cpw:"",chpw:""});
    };

    const getUserData = async () => {
    
        try {
            const response = await fetch(`${URL}/modify/getAdminData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
                credentials: "include"
            });

            if(!response.ok) {
                throw new Error("서버 오류");
            }

            const result = await response.json();

            setFirst({userid: result.userid || "",
                password: result.password || "",
                name: result.name || "",
                email: result.email || "",
                mobile: result.mobile || "",
                gender: result.gender || "",
                birth: result.birth ? `${result.birth.slice(0, 4)}/${result.birth.slice(4, 6)}/${result.birth.slice(6, 8)}` : "",
                created: result.created
            });

            setModifyValue({
                userid: result.userid || "",
                password: result.password || "",
                name: result.name || "",
                email: result.email || "",
                mobile: result.mobile || "",
                gender: result.gender || "",
                birth: result.birth ? `${result.birth.slice(0, 4)}/${result.birth.slice(4, 6)}/${result.birth.slice(6, 8)}` : "",
                created: result.created
            });

        } catch(error) {
            alert(error.message);
            return;
        }

    };

    useEffect(() => {
        getUserData();
    },[]);

    const goUpdate = async(e) => {
        console.log(modifyvalue);

        if(!availableid || !availablepw || !availablemobile) {
            alert("인증을 다 받으십시오");
            return;
        }

        try{

            const response = await fetch(`${URL}/modify/updateAdminInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modifyvalue),
                credentials: "include"
            });

            if(response.ok) {
                const data = await response.text();
                // 만약 수정이 되면 alert문 띄우고 로그아웃 시키기
                if(data === "") {
                    alert("수정 성공! 로그아웃 됩니다");
                    navigate('/');
                } 
            };

        } catch(error) {
            alert(error.message);
            return;
        }

    };

    const handleDelete = async (e) => {
        
        if(sentence !== phrase.phrase) {
            alert("문구를 정확히 입력해주십시오");
            return;
        }

        try{

            const response = await fetch(`${URL}/modify/deleteAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modifyvalue),
                credentials: "include"
            });

            if(response.ok) {
                const data = await response.text();
                if(data === "") {
                    alert("탈퇴되었습니다.");
                    setPopup(false);
                    navigate('/');
                } 
            };

        } catch(error) {
            alert(error.message);
            return;
        }

    };

    return(

        <div className="ModifyUserUIEntireDiv">

            <p className="ModifyUserUIHeader" onClick={goHome}>Super Board</p>

            <div className="ModifyUserUiModifyDiv">

                <p className="ModifyUserUIDivHeader">개인정보변경</p>
                <p className="ModifyUserUIDivHeaderSub">고객님의 개인정보보호를 위해 최선을 다하겠습니다.</p>

                <table className="ModifyUserUITable">
                    <tbody>
                        <tr>
                            <td>
                                <label className="ModifyUserUITableLabel">아이디</label>
                            </td>
                            <td>
                                <input type="text" className="ModifyUserUITableText" onChange={setValueId} value={modifyvalue.userid} name="userid" readOnly />
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="ModifyUserUITableLabel">비밀번호</label>
                            </td>
                            <td>
                                <input type="password" className="ModifyUserUITableText" value={first.password} name="password" readOnly />
                            </td>
                            <td>
                                <input type="button" className="ModifyUserUITalbeBtn" onClick={printModifyPassword} value="변경" />
                            </td>
                        </tr>
                        {/* 버튼 클릭 시 새로 추가될 tr */}
                        {showNewPasswordRow && (
                            <>
                                <tr>
                                    <td>
                                        <label className="ModifyUserUITableLabel">현재 비밀번호</label>
                                    </td>
                                    <td colSpan="2">
                                        <input type="password" className="ModifyUserUITableText" value={newpw.cpw} onChange={currentPassword} name="cpw" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className="ModifyUserUITableLabel">새 비밀번호</label>
                                    </td>
                                    <td colSpan="2">
                                        <input type="password" className="ModifyUserUITableText" value={newpw.npw} onChange={newPassword} name="npw" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className="ModifyUserUITableLabel">비밀번호 확인</label>
                                    </td>
                                    <td colSpan="2">
                                        <input type="password" className="ModifyUserUITableText" value={newpw.chpw} onChange={newPassword} name="chpw" />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="3">
                                        <input type="button" className="ShowNewPasswordBtn" onClick={changePassword} value="확인" />
                                        <input type="button" className="ShowNewPasswordBtn" onClick={resetPassword} value="초기화" />
                                    </td>
                                </tr>
                            </>
                        )}
                        <tr>
                            <td>
                                <label className="ModifyUserUITableLabel">이름</label>
                            </td>
                            <td>
                                <input type="text" className="ModifyUserUITableText" value={modifyvalue.name} name="name" readOnly />
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <label className="ModifyUserUITableLabel">모바일번호(-빼고)</label>
                            </td>
                            <td>
                                <input type="text" className="ModifyUserUITableText" onChange={setValueM} value={modifyvalue.mobile} name="mobile" />
                            </td>
                            <td>
                                <input type="button" className="ModifyUserUITalbeBtn" onClick={updateMobile} value="변경" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="ModifyUserUITableLabel">성별</label>
                            </td>
                            <td>
                                <input type="text" className="ModifyUserUITableText" value={modifyvalue.gender} name="gender" readOnly />
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <label className="ModifyUserUITableLabel">생일</label>
                            </td>
                            <td>
                                <input type="text" className="ModifyUserUITableText" value={modifyvalue.birth} name="birth" readOnly />
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                {/* 팝업창 띄우는 곳(css삭제하지 마시오!!!!) */}
                {popup && (
                    <div className="modal-overlay">
                    <div className="modal-box">
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
                        회원가입 탈퇴
                        </h2>
                        <p style={{ marginBottom: "1rem" }}>
                        회원탈퇴 시 계정 및 개인정보는 모두 삭제되며,<br />
                        <strong>삭제된 정보는 복구할 수 없습니다.<br /></strong>
                        탈퇴를 진행하시겠습니까?<br />
                        정말 탈퇴하시겠다면<br /> 
                        <strong>"{modifyvalue.userid}/탈퇴하겠습니다"</strong>를 입력하십시오. 
                        </p>
                        <input type="text" className="modal-inputtype-text-confirm" onChange={deletePhrase} name="phrase" placeholder="(' '빼고 입력하십시오)" />
                        <div className="modal-buttons">
                        <button className="modal-cancel-btn" onClick={() => setPopup(false)}>
                            취소
                        </button>
                        <button className="modal-delete-btn" onClick={handleDelete}>
                            삭제
                        </button>
                        </div>
                    </div>
                    </div>
                )}

                <input type="button" className="ModifyUserUIFooterBtn" onClick={goUpdate} value="수정" />
                <input type="button" className="ModifyUserUIFooterBtn" onClick={() => setPopup(true)} value="회원탈퇴" />
                <input type="button" className="ModifyUserUIFooterBtn" onClick={goHome} value="홈으로" />

            </div>

        </div>

    );

}