import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import './FindPassword.css';

const URL = process.env.REACT_APP_API_URL;

export default function FindPassword() {

    const navigate = useNavigate();
    const [findpwvalue, setFindPwValue] = useState({userid:"", email:""});

    // 타이머용 State
    const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초
    const [timerActive, setTimerActive] = useState(false);
    const timerId = useRef(null);

    // 인증코드 입력 State
    const [checkEmail, setCheckEmail] = useState("");

    // 인증이 됐는지 확인하는 State
    const [authEmail, setAuthEmail] = useState(false);

    const doChange = (e) => {
        let {name, value} = e.target;
        setFindPwValue((prev) => ({...prev, [name]:value}));
    };

    const getFindPw = async (e) => {

        if(authEmail === false) {
            alert("이메일 인증을 완료하십시오.");
            return;
        }

        try {
            const response = await fetch(`${URL}/fip/findpw`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(findpwvalue),
                credentials: "include"
            });

            if(!response.ok) {
                throw new Error("서버 오류");
            }

            const result = await response.text();
            if(result.trim() === "" || result.trim().startsWith("오")) {
                alert(result); 
            } else {
                alert("비밀번호는 " + result + "입니다.");
            }

        } catch(error) {
            alert(error.message);
        }

    };

    const goHome = (e) => {
        navigate('/');
    };

    const goLogin = (e) => {
        navigate('/login');
    };

    const EmailAuthentication = async (e) => {

        const userid = findpwvalue.userid;
        const email = findpwvalue.email;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(userid.trim().length > 16 || /[!@#$%^&*(),.?":{}|<>]/.test(userid) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(userid)) {
            alert("잘못된 접근입니다(아이디)");
            return;
        }

        if(/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(email) || !regex.test(email)) {
            alert("잘못된 접근입니다(이메일)");
            return;
        }

        // 아이디와 이메일이 DB내에 존재하는지 확인하고 이메일 인증하는 fetch문
        try {
            const response = await fetch(`${URL}/fip/checkAuth`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(findpwvalue),
                credentials: "include"
            })

            if(response.ok) {
                const result1 = await response.text();
                if(!result1 === "") {
                    alert("해당 아이디 또는 이메일이 존재하지 않습니다.");
                    return;
                } 
            }

        } catch(error) {
            alert(error.message);
        }

        // 바로 타이머 시작
        if (!timerActive) {
            setTimerActive(true);
            timerId.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 0) {
                        clearInterval(timerId.current);
                        setTimerActive(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        try {

            const response = await fetch(`${URL}/email/sendMail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email}),
                credentials: "include"
            });

            if(response.ok) {
                const data = await response.text();
                if(!data === "") {
                    alert(data);
                };
            };

        } catch(error) {
            alert(error.message);
        } 

    };

    // 타이머를 분:초 형식으로 보여주는 컴포넌트
    const TimerDisplay = ({ timeLeft }) => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return (
            <div className="SUGap3">
                <p style={{ color: 'red', fontSize: '14px', textAlign:"center"}}>
                    {timeLeft > 0 ? (
                        `남은시간: ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
                    ) : (
                        "시간만료"
                    )}
                </p>
            </div>
        );
    };

    // 버튼누르면 인증코드가 맞는지 확인하는 메소드(setAuthEmail이용)
    const checkEmailAuthentication = async (e) => {

        const email = findpwvalue.email;

        try{

            const response = await fetch(`${URL}/email/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: checkEmail
                }),
                credentials: "include"
            });

            if(response.ok) {
                const data = await response.text();
                if(!data === "") {
                    alert(data);
                } else {
                    alert("인증 완료되었습니다");
                    clearInterval(timerId.current);
                    setTimerActive(false);  
                    setAuthEmail(true);
                }
            };

        } catch(error) {
            alert(error.message);
        }
        
    };

    // 인증코드 입력하는 onChange
    const CheckAuthentication = (e) => {
        setCheckEmail(e.target.value);
    };

    return(
        
        <div className="LFPEtireDiv">

            <label className="LFPHeaderTableLabel">비밀번호 찾기</label>

            {/* <table className="LFPHeaderTable">
                <tbody>
                    <tr>
                        <td>
                            <label className="LFPHeaderTableLabel">비밀번호 찾기</label>
                        </td>
                        <td className="LFPHeaderTableGap"></td>
                    </tr>
                </tbody>
            </table> */}

            <div className="LFPCenterPrintDiv">

                <label className="LFPCenterPrintDivh3">회원정보에 등록한 아이디로 인증</label>
                <br />
                <label className="LFPCenterPrintDivh4">회원정보에 등록한 이메일을 입력하셔야<br />인증번호를 받을 수 있습니다.</label>

                <table className="LFPCenterTable">
                    <tbody>
                        <tr>
                            <td>
                                <label className="LFPCenterTableLabel">아이디</label>
                            </td>
                            <td>
                                <input type="text" className="LFPCenterTableInputtext" autoComplete="off" name="userid" onChange={doChange} />
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <label className="LFPCenterTableLabel">이메일</label>
                            </td>
                            <td>
                                <input type="text" className="LFPCenterTableInputtext" autoComplete="off" name="email" onChange={doChange} placeholder="이메일"/>
                            </td>
                            <td>
                                <input type="button" className="LFPCenterTableBtn1" value="인증번호 받기" onClick={EmailAuthentication} /> 
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <input type="text" autoComplete="off" className="LFPCenterTableInputAuth" onChange={CheckAuthentication} placeholder="인증코드"/>
                            </td>
                            <td>
                                <input type="button" className="LFPCenterTableBtnAuth" value="인증하기" onClick={checkEmailAuthentication} />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td><TimerDisplay timeLeft={timeLeft} /></td>
                        </tr>
                    </tbody>
                </table>

                <input type="button" className="LFPBtn" value="비밀번호 찾기" onClick={getFindPw} />
                <input type="button" className="LFPBtn" value="로그인" onClick={goLogin} />
                <input type="button" className="LFPBtn" value="홈으로" onClick={goHome} />
            
            </div>

        </div>
    );

}