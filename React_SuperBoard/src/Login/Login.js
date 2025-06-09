import { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import "./Login.css";

const URL = process.env.REACT_APP_API_URL;

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loginvalue, setLoginValue] = useState({userid:"", password:""});
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const doChange = (e) => {
        let {name, value} = e.target;
        setLoginValue((prev) => ({...prev, [name]:value}));
    };

    const doLogin = async (e) => {

        if(loginvalue.userid.trim().length > 16 || loginvalue.password.trim().length > 16) {
            alert("잘못된 입력입니다.");
            return;
        }

        if(loginvalue.userid.trim() === '' || loginvalue.password.trim() === '') {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        if((/[ㄱ-ㅎㅏ-ㅣ]/.test(loginvalue.userid)) || (/[ㄱ-ㅎㅏ-ㅣ]/.test(loginvalue.password)) ) {
            alert("입력값에 한글이 포함되어 있습니다.");
            return;
        }

        if((/[!@#$%^&*(),.?":{}|<>]/.test(loginvalue.userid)) || (/[!@#$%^&*(),.?":{}|<>]/.test(loginvalue.password))) {
            alert("입력값에 특수문자가 포함되어 있습니다.");
            return;
        }

        try {
            const response = await fetch(`${URL}/login/doLogin`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginvalue),
                credentials: "include"
            });

            if(!response.ok) {
                throw new Error("서버 오류");
            }

            const result = await response.text();

            if(result === "") {
                alert("로그인 성공!");
                setIsLoggedIn(true);
            } else if(result === "1") {
                alert("로그인 성공!");
                navigate("/modifyadminpw");
            } else if(result === "0") {
                alert("로그인 성공!");
                setIsLoggedIn(true);
            } else {
                alert(result);
                setLoginValue({userid:"", password:""});
            }

        } catch(error) {
            alert(error.message);
        }

    };

    const goSignup = (e) => {
        navigate('/signup');
    };

    useEffect(() => {
        if (isLoggedIn) {
            // 로그인 후 리디렉션될 경로 확인
            const from = location.state?.from || '/';
            console.log('로그인 후 전달받은 from:', location.state?.from);
            console.log('리디렉션될 페이지:', from);
            navigate(from);
        }
    }, [isLoggedIn, location.state, navigate]);

    const goFindId = (e) => {
        navigate('/findid');
    };

    const goFindPassword = (e) => {
        navigate('/findpw');
    };

    const goHome = (e) => {
        navigate('/');
    };

    return(

        <div className="LPDiv">
            <h1 className="LPHeaderH1" onClick={goHome}>Super Board</h1>

            <div className="LPLDiv">
                <div className="LPLInputDiv">
                        <input type="text" className="LPLSetInput" onChange={doChange} name="userid" placeholder="아이디" />
                </div>
                <div className="LPLEtcDiv"></div>
            </div>

            <div className="LPLDiv">
                <div className="LPLInputDiv">
                        <input type="password" className="LPLSetInput" onChange={doChange} name="password" placeholder="비밀번호" />
                </div>
                <div className="LPLEtcDiv"></div>
            </div>

            <div className="LPGap"></div>

            <div className="LPLDiv">

                <input type="button" className="LPLBtn" onClick={doLogin} value="로그인" />
                <input type="button" className="LPLBtn" onClick={goSignup} value="회원가입" />

            </div>

            <div className="LPLFooterDiv">
                
                <span className="FooterSpan" onClick={goFindId}>아이디 찾기</span>
                <span className="FooterWall">|</span>
                <span className="FooterSpan" onClick={goFindPassword}>비밀번호 찾기</span>

            </div>

        </div>

    );

};