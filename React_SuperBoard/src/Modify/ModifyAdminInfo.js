import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import './ModifyUserInfo.css';

const URL = process.env.REACT_APP_API_URL;

export default function ModifyAdminInfo() {

    const navigate = useNavigate();
    
        const [pw, setPw] = useState({userid: "",password:"",name:"",created:""});
    
        const goHome = (e) => {
            navigate('/');
        };
    
        const inputPw = (e) => {
            let {name, value} = e.target;
            setPw((prev) => ({...prev, [name]:value}));
        };
    
        const checkPw = async (e) => {
    
            if(pw.password === "" || pw.password.trim().length > 16 || /[!@#$%^&*(),.?":{}|<>]/.test(pw.password) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(pw.password)) {
                alert("비밀번호를 다시 입력하십시오.");
                setPw({password:""});
                return;
            };

            console.log(pw);
    
            try {
                const response = await fetch(`${URL}/modify/checkAdmin`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pw),
                    credentials: "include"
                });
    
                if(!response.ok) {
                    throw new Error("서버 오류");
                }
    
                const result = await response.text();
    
                if(result === "") {
                    alert("인증 성공!");
                    navigate("/modifyadmin");
                } else {
                    alert(result);
                }
    
            } catch(error) {
                alert(error.message);
            }
    
        };
    
        const checkUser = async () => {
    
            try {
                const response = await fetch(`${URL}/login/getUser`, {
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
                setPw(result);
    
            } catch(error) {
                alert(error.message);
            }
    
        };
    
        useEffect(() => {
            checkUser();
        },[]);
    
        return(
    
            <div className="BeforeModifyUIEntireDiv">
    
                <p className="BeforeModifyHeader" onClick={goHome}>Admin Board</p>
    
                <div className="BeforeModifyPrintDiv">
    
                    <div className="BeforeModifyPrintP">
                        <span className="BeforeModifyPrintSpanTagMain">개인정보변경</span>
                        <span className="BeforeModifyPrintSpanTagSub">고객님의 개인정보보호를 위해 최선을 다하겠습니다.</span>
                    </div>
    
                    <p className="BeforeModifyPrintCenter">고객님의 개인정보 보호를 위해 본인확인을 진행합니다.<br />계정 비밀번호를 입력해주세요</p>
                    
                    <table className="BeforeModifyTable">
                        <tbody>
                            <tr>
                                <td>
                                    <label className="BeforeModifyTableLabel">비밀번호 확인</label>
                                </td>
                                <td>
                                    <input type="password" className="BeforeModifyTableText" value={pw.password} onChange={inputPw} autoComplete='off' name="password" />
                                </td>
                                <td>
                                    <input type="button" className="BeforeModifyTableBtn" onClick={checkPw} value="확인" readOnly />
                                </td>
                            </tr>
                        </tbody>
                    </table>
    
                </div>
    
            </div>
    
        );

}