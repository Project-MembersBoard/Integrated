import { useState, useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";


const URL = process.env.REACT_APP_API_URL;

const Key = "aF9kL2pR8wXzT3Nh";

export default function Signup() {

    const navigate = useNavigate();

    const [submitData, setSubmitData] = useState({userid:"", password:"", email:"", name:"", birth:"", mobile:"", gender:"", type:""}); // 회원가입 할 때 보낼 데이터

    const [showPassword, setShowPassword] = useState(false); // 비밀번호를 text로 보여줄지, password로 보여줄지 정하는거

    // 아이디 체크할 때 사용하는거
    const [userid, setUserid] = useState(''); // 유저 아이디 입력값을 저장하는 용도
    const [useridMessage, setUseridMessage] = useState(''); // SUGap 안에 p태그에서 메세지를 띄울 때 메세지 저장용 state
    const [useridAvailable, setUseridAvailable] = useState(null); // 유저 아이디를 사용할 수 있는지 없는지 확인 용도 

    // 비밀번호 체크할 때 사용하는거
    const [pw, setPw] = useState('');
    const [pwMessage, setPwMessage] = useState(''); 
    const [pwAvailable, setPwAvailable] = useState(null); 

    // 이메일 체크할 때 사용하는거
    const [email,setEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState(''); 
    const [emailAvailable, setEmailAvailable] = useState(null); 

    // 이름 체크할 때 사용하는거
    const [name,setName] = useState('');
    const [nameMessage, setNameMessage] = useState(''); 
    const [nameAvailable, setNameAvailable] = useState(null); 

    // 생년월일 체크할 때 사용하는거
    const [birth,setBirth] = useState('');
    const [birthMessage, setBirthMessage] = useState(''); 
    const [birthAvailable, setBirthAvailable] = useState(null); 

    // 휴대폰 번호 체크할 때 사용하는거
    const [mobile,setMobile] = useState('');
    const [mobileMessage, setMobileMessage] = useState(''); 
    const [mobileAvailable, setMobileAvailable] = useState(null); 

    // 인증코드 입력 State
    const [checkEmail, setCheckEmail] = useState("");

    // 인증이 됐는지 확인하는 State
    const [authEmail, setAuthEmail] = useState(false);

    // 타이머용 State
    const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초
    const [timerActive, setTimerActive] = useState(false);
    const timerId = useRef(null);

    // 버튼 클릭하면 출력문 바뀌게 하는 용도
    const [buttonValue, setButtonValue] = useState('인증번호 받기');


    const setId = (e) => {
        setUserid(e.target.value);
    };

    const inputPw = (e) => {
        setPw(e.target.value);
    };

    const inputEmail = (e) => {
        setAuthEmail(false);
        setEmail(e.target.value);
    };

    const inputName = (e) => {
        setName(e.target.value);
    }

    const inputBirth = (e) => {
        setBirth(e.target.value);
    }

    const inputMobile = (e) => {
        setMobile(e.target.value);
    }

    // 아이디 입력했을 때 중복을 확인하는 용도로 사용하는 useEffect
    useEffect(() => {

        // 사용자가 아무것도 입력하지 않았을때 
        if (userid.trim() === '') {
            setUseridMessage('');
            setUseridAvailable(null);
            return;
        }

        // 사용자가 id를 admin으로 할경우(이건 관리자 전용)
        if(userid === "admin") {
            setUseridMessage('사용불가능한 아이디입니다');
            setUseridAvailable(false);
            setSubmitData(prev => ({
                ...prev,
                userid:userid
            }));
            return;
        }

        // 사용자의 아이디가 16자리 이상일 경우
        if(userid.trim().length > 16) {
            setUseridMessage('아이디: 사용 불가능한 아이디입니다.');
            setUseridAvailable(false);
            return;
        }

        // 특수 기호가 포함 되어있으면 리턴
        if(/[!@#$%^&*(),.?":{}|<>]/.test(userid)) {
            setUseridMessage('아이디: 특수기호는 사용 불가능합니다.');
            setUseridAvailable(false);
            return;
        }

        // 한글이 포함되어있을 때
        if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(userid)) {
            setUseridMessage('아이디: 한글은 사용할 수 없습니다.');
            setUseridAvailable(false);
            return;
        }
    
        const timer = setTimeout(async () => {
          try {
            const response = await fetch(`${URL}/signup/checkUserid`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: userid }),
              credentials: "include"
            });
    
            if (!response.ok) throw new Error('서버 오류');
    
            const data = await response.json();
    
            if (data.available) {
                setUseridAvailable(true);
                setUseridMessage('아이디: 사용 가능한 아이디입니다.');
                setSubmitData(prev => ({
                    ...prev,
                    userid:userid
                }));
            } else {
                setUseridAvailable(false);
                setUseridMessage('아이디: 이미 사용 중인 아이디입니다.');
            }
          } catch (error) {
            setUseridAvailable(false);
            alert(error.message); // ← 이 줄을 활성화하면 alert창으로 에러 표시 가능
          }
        }, 500); // 디바운스 (0.5초 입력 멈춤 감지)
    
        return () => clearTimeout(timer);
    }, [userid]);

    // 비밀번호 입력했을 때 확인하는 용도로 사용하는 useEffect
    useEffect(() => {

        // 사용자가 아무것도 입력하지 않았을때 
        if (pw.trim() === '') {
            setPwMessage('');
            setPwAvailable(null);
            return;
        }

        if(pw === Key && userid === "admin") {
            setUseridAvailable(true);
            setUseridMessage('');
            setPwAvailable(true);
            setEmailAvailable(true);
            setAuthEmail(true);
            setSubmitData(prev => ({
                ...prev,
                password:Key
            }));
            return;
        }

        // 사용자의 비밀번호가 16자리 이상일 경우
        if(pw.trim().length > 16 || /[!@#$%^&*(),.?":{}|<>]/.test(pw) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(pw)) {
            setPwMessage('비밀번호: 사용 불가능한 비밀번호입니다.');
            setPwAvailable(false);
            return;
        } else {
            setPwAvailable(true);
            setPwMessage('비밀번호: 사용 가능한 비밀번호입니다.');
            setSubmitData(prev => ({
                ...prev,
                password:pw
            }));
        }

    }, [pw,userid]);

    // 이메일 입력했을 때 확인하는 용도로 사용하는 useEffect
    useEffect(() => {

        // 사용자가 아무것도 입력하지 않았을때 
        if (email.trim() === '') {
            setEmailMessage('');
            setEmailAvailable(false);

            return;
        }

        if(/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(email)) {
            setEmailMessage('이메일: 올바른 이메일 형식이 아닙니다');
            setEmailAvailable(false);
            return;
        }

        const isValidEmail = (email) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email);
        };

        if(!isValidEmail(email)) {
            setEmailMessage('이메일: 올바른 이메일 형식이 아닙니다');
            setEmailAvailable(false);
            return;
        }

        const timer = setTimeout(async () => {

            try {
                const response = await fetch(`${URL}/signup/checkEmail`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
                credentials: "include"
            });
      
            if (!response.ok) throw new Error('서버 오류');
      
            const data = await response.json();
      
            if (data.available) {
                setEmailMessage('이메일: 사용 가능한 이메일입니다.');
                setEmailAvailable(true);
                setSubmitData(prev => ({
                    ...prev,
                    email:email
                }));
            } else {
                setEmailAvailable(false);
                setEmailMessage('이메일: 이미 사용중인 이메일입니다.');
            }
        } catch (error) {
            setEmailAvailable(false);
            alert(error.message); // ← 이 줄을 활성화하면 alert창으로 에러 표시 가능
            }
        }, 500); // 디바운스 (0.5초 입력 멈춤 감지)

        return () => clearTimeout(timer);

    },[email]);

    // 이름 입력했을 때 확인하는 용도로 사용하는 useEffect
    useEffect(() => {

        // 사용자가 아무것도 입력하지 않았을때 
        if (name.trim() === '') {
            setNameMessage('');
            setNameAvailable(null);
            return;
        }

        // 특수 기호가 포함 되어있으면 리턴
        if(/[!@#$%^&*(),.?":{}|<>]/.test(name)) {
            setNameMessage('이름: 잘못된 이름입니다.');
            setNameAvailable(false);
            return;
        }

        if(/\d/.test(name)) {
            setNameMessage('이름: 잘못된 이름입니다.');
            setNameAvailable(false);
            return;
        }

        if(name.trim().length > 32) {
            setNameMessage('이름: 사용 불가능한 이름입니다.');
            setNameAvailable(false);
            return;
        } 

        if (!/^[가-힣]+$/.test(name)) {
            setNameMessage('이름: 완성된 문자만 입력 가능합니다.');
            setNameAvailable(false);
            return;
        }

        setNameMessage('');
        setNameAvailable(true);
        setSubmitData(prev => ({
            ...prev,
            name:name
        })); 

    },[name]);

    // 생년월일 입력했을 때 확인하는 용도로 사용하는 useEffect
    useEffect(() => {

        // 사용자가 아무것도 입력하지 않았을때 
        if (birth.trim() === '') {
            setBirthMessage('');
            setBirthAvailable(null);
            return;
        }

        // 특수 기호가 포함 되어있으면 리턴
        if(/[!@#$%^&*(),.?":{}|<>]/.test(birth)) {
            setBirthMessage('생년월일: 잘못된 생일입니다.');
            setBirthAvailable(false);
            return;
        }

        if(/[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/.test(birth)) {
            setBirthMessage('생년월일: 이상한 값이 포함되어있습니다.');
            setBirthAvailable(false);
            return;
        }

        if(birth.trim().length > 8) {
            setBirthMessage('생년월일: 잘못된 형식의 생일입니다.');
            setBirthAvailable(false);
            return;
        }  

        setBirthMessage('');
        setBirthAvailable(true);
        setSubmitData(prev => ({
            ...prev,
            birth:birth
        }));

        
    },[birth]);

    // 휴대폰 번호 입력했을 때 중복을 확인하는 용도로 사용하는 useEffect
    useEffect(() => {

        const cleanMobile = mobile.replace(/-/g, '').trim();
        const regex = /^010\d{8}$/;

        // 사용자가 아무것도 입력하지 않았을때 
        if (cleanMobile.trim() === '') {
            setMobileMessage('');
            setMobileAvailable(null);
            return;
        }

        if(cleanMobile.trim().length > 11 || cleanMobile.trim().length < 11) {
            setMobileMessage('휴대폰번호: 사용 불가능한 번호입니다.');
            setMobileAvailable(false);
            return;
        }

        // 자음, 모음 단독 방지
        if (/[ㄱ-ㅎㅏ-ㅣ]/.test(cleanMobile)) {
            setMobileMessage('휴대폰번호에 자음/모음 입력은 불가능합니다.');
            setMobileAvailable(false);
            return;
        }

        if(/^[A-Za-z]+$/.test(cleanMobile)) {
            setMobileMessage('휴대폰번호에 대소문자 입력은 불가능합니다.');
            setMobileAvailable(false);
            return;
        }

        if(!/^[0-9]+$/.test(cleanMobile)) {
            setMobileMessage('휴대폰번호에 특수기호 입력은 불가능합니다.');
            setMobileAvailable(false);
            return;
        }

        if (!regex.test(cleanMobile)) {
            console.log(cleanMobile);
            console.log(regex.test(cleanMobile));
            setMobileMessage('010으로 시작하는 11자리 숫자여야 합니다.');
            setMobileAvailable(false);
            return; 

        } else {
            console.log(cleanMobile);
            console.log(regex.test(cleanMobile));
            setMobileMessage('');
            setMobileAvailable(true);
        }
    
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`${URL}/signup/checkMobile`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ mobile: cleanMobile }),
                    credentials: "include"
                });
        
                if (!response.ok) throw new Error('서버 오류');
        
                const data = await response.json();
        
                if (data.available) {
                    setMobileAvailable(true);
                    setMobileMessage('휴대폰번호: 사용 가능한 번호입니다.');
                    setSubmitData(prev => ({
                        ...prev,
                        mobile: mobile
                    }));
                } else {
                    setMobileAvailable(false);
                    setMobileMessage('휴대폰번호: 이미 사용 중인 번호입니다.');
                }
            } catch (error) {
                setMobileAvailable(false);
                alert(error.message); // ← 이 줄을 활성화하면 alert창으로 에러 표시 가능
            }
        }, 500); // 디바운스 (0.5초 입력 멈춤 감지)
    
        return () => clearTimeout(timer);
    }, [mobile]);

    const setMale = (e) => {
        setSubmitData(prev => ({
            ...prev,
            gender: "남성"
        }));
    };

    const setFemale = (e) => {
        setSubmitData(prev => ({
            ...prev,
            gender: "여성"
        }));
    };

    const doSignup =  async (e) => {

        if(pw === Key && userid === "admin") {
            submitData.type = "admin";
        }

        if(submitData.gender.trim().length > 2) {
            alert("잘못된 접근입니다.");
            return;
        }

        if(authEmail === false) {
            alert("이메일 인증을 완료하십시오.");
            return;
        }

        if(useridAvailable === false || pwAvailable === false || nameAvailable === false || emailAvailable === false || birthAvailable === false || mobileAvailable === false || submitData.gender === "" ) {
            alert("모든 값을 다 입력하십시오");
            return;
        }

        try {
            const response = await fetch(`${URL}/signup/doSignup`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
                credentials: "include"
            });

            if(!response.ok) {
                throw new Error("회원가입에 실패했습니다.");
            } 
            const data = await response.text();
            if(data === "") {
                alert("회원가입 성공!!");
                setSubmitData({userid:"", password:"", email:"", name:"", birth:"", mobile:"", gender:"", type:""});
                navigate('/login');
            } else if(data.trim().length === 8){
                alert(`임시비밀번호는 ${data} 입니다`);
                setSubmitData({userid:"", password:"", email:"", name:"", birth:"", mobile:"", gender:"", type:""});
                navigate('/login');
            } else {
                alert(data);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const goLogin = (e) => {
        navigate('/');
    };

    const EmailAuthentication = async (e) => {

        if(email === "") {
            alert("이메일을 입력하십시오.");
            return;
        }

        if(emailAvailable === false) {
            alert("해당 이메일은 사용중입니다.");
            return;
        }

        setButtonValue('전송완료');

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
            <div className="SUGap">
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

    // 인증코드 입력하는 onChange
    const CheckAuthentication = (e) => {
        setCheckEmail(e.target.value);
    };

    // 버튼누르면 인증코드가 맞는지 확인하는 메소드(setAuthEmail이용)
    const checkEmailAuthentication = async (e) => {

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
                if(data !== "") {
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

    const goHome = (e) => {
        navigate('/');
    }

    return(

        // 전체를 감싸는 div 왼쪽 오른쪽 margin설정(가운데 출력되는 부분은 한 전체에 커봤자 40%? 작으면 33%정도만 사용하도록 margin설정)
        <div className="SUEntireDiv">

            {/* 홈으로 가는 h2태그 */}
            <h2 className="SUHeaderH2" onClick={goHome}>Super Board</h2>

            <div className="SUMadeByDiv"></div>

            {/* 모든 입력 창들을 크게 감싸는 div */}
            <div className="SUPrintDiv">

                {/* 아이디 */}
                <div className="SUWrapPrintDiv">
                    {/* div 안에 있는 태그들은 모두 가로로 한줄로 나오게(div태그 사이 padding은 작게) */}
                    <div className="SUPWraoIcon">
                        <label className="SUPrintIcon">👤</label>
                    </div>
                    <div className="SUPInputDiv">
                        <input type="text" className="SUPSetInput" onChange={setId} placeholder="아이디" />
                    </div>
                    <div className="SUPEtcDiv"></div>
                </div>

                {/* 비밀번호 */}
                <div className="SUWrapPrintDiv">
                    {/* div 안에 있는 태그들은 모두 가로로 한줄로 나오게(div태그 사이 padding은 작게) */}
                    <div className="SUPWraoIcon">
                        <label className="SUPrintIcon">🔑</label>
                    </div>
                    <div className="SUPInputDiv">
                        <input type={showPassword ? 'text' : 'password'} onChange={inputPw} className="SUPSetInput" placeholder="비밀번호" />
                    </div>
                    <div className="SUPEtcDiv">
                        {/* 이거 버튼 border 없애주고 cursur:pointer로 해줘 */}
                        <button type="button" onClick={() => setShowPassword(!showPassword) }>{showPassword ? '🚫' : '👁️'}</button>
                    </div>
                </div>

                {/* 이메일 */}
                <div className="SUWrapPrintDiv">
                    {/* div 안에 있는 태그들은 모두 가로로 한줄로 나오게(div태그 사이 padding은 작게) */}
                    <div className="SUPWraoIcon">
                        <label className="SUPrintIcon">📧</label>
                    </div>
                    <div className="SUPInputDiv2">
                        <input type="text" className="SUPSetInput" onChange={inputEmail} placeholder="이메일" />
                    </div>
                    <div className="SUPEtcDiv">
                        <input type="button" className="SUPsetBtn" onClick={EmailAuthentication} value={buttonValue} />
                    </div>
                    <div className="SUPEtcDiv">
                    </div>
                </div>

                <div className="SUWrapPrintDiv">
                    <div className="SUPWraoIcon">
                        <label className="SUPrintIcon">⛓</label>
                    </div>
                    <div className="SUPInputDiv2">
                        <input type="text" className="SUPSetInput3" onChange={CheckAuthentication} placeholder="인증코드"  />
                    </div>
                    <TimerDisplay timeLeft={timeLeft} />
                    <input type="button" className="SUPsetBtn2" onClick={checkEmailAuthentication} value="확인" />
                </div>

                {/* 여기에는 gap만(위 div들과 아래 div를 살짝 떨어트리는 용도 + 여기에 아이디랑 비밀번호 사용 불가능하면 여기에 출력시킬 예정) */}
                <div className="SUGap">
                    {useridMessage && (
                        <p style={{ color: useridAvailable ? 'green' : 'red' }}>
                        {useridMessage}</p>
                    )}
                    {pwMessage && (
                        <p style={{ color: pwAvailable ? 'green' : 'red' }}>
                        {pwMessage}</p>
                    )}
                    {emailMessage && (
                        <p style={{ color: emailAvailable ? 'green' : 'red' }}>
                        {emailMessage}</p>
                    )}
                </div>

                {/* 이름 */}
                <div className="SUWrapPrintDiv">
                    {/* div 안에 있는 태그들은 모두 가로로 한줄로 나오게(div태그 사이 padding은 작게) */}
                    <div className="SUPWraoIcon">
                        <label className="SUPrintIcon">👤</label>
                    </div>
                    <div className="SUPInputDiv">
                        <input type="text" className="SUPSetInput" onChange={inputName} placeholder="이름" />
                    </div>
                    <div className="SUPEtcDiv"></div>
                </div>

                {/* 생년월일 */}
                <div className="SUWrapPrintDiv">
                    {/* div 안에 있는 태그들은 모두 가로로 한줄로 나오게(div태그 사이 padding은 작게) */}
                    <div className="SUPWraoIcon">
                        <label className="SUPrintIcon">🗓️</label>
                    </div>
                    <div className="SUPInputDiv">
                        <input type="text" className="SUPSetInput" onChange={inputBirth} placeholder="생년월일(8자리)" />
                    </div>
                    <div className="SUPEtcDiv"></div>
                </div>

                {/* 휴대폰번호 */}
                <div className="SUWrapPrintDiv">
                    {/* div 안에 있는 태그들은 모두 가로로 한줄로 나오게(div태그 사이 padding은 작게) */}
                    <div className="SUPWraoIcon">
                        <label className="SUPrintIcon">📱</label>
                    </div>
                    <div className="SUPInputDiv">
                        <input type="text" className="SUPSetInput" onChange={inputMobile} placeholder="휴대폰 번호(-제외)" />
                    </div>
                    <div className="SUPEtcDiv"></div>
                </div>

                <div className="SUGap">
                    {nameMessage && (
                        <p style={{ color: nameAvailable ? 'green' : 'red' }}>
                        {nameMessage}</p>
                    )}
                    {birthMessage && (
                        <p style={{ color: birthAvailable ? 'green' : 'red' }}>
                        {birthMessage}</p>
                    )}
                    {mobileMessage && (
                        <p style={{ color: mobileAvailable ? 'green' : 'red' }}>
                        {mobileMessage}</p>
                    )}
                </div>

                {/* 성별 */}
                <div className="SUWrapPrintDiv">
                    {/* div 안에 있는 태그들은 모두 가로로 한줄로 나오게(div태그 사이 padding은 작게) */}
                    <div className="SUPInputDiv3">
                        {/* 성별을 radio버튼이 아니라 일반 버튼(div중간에 나오게 버튼 크기는 작지 않도록(div크기의 절반은 차지할 수 있도록)) */}
                        <input type="button" className={`SUPSetButton ${submitData.gender === '여성' ? 'active' : ''}`} value="여성" onClick={setFemale} readOnly />
                        <input type="button" className={`SUPSetButton ${submitData.gender === '남성' ? 'active' : ''}`} value="남성" onClick={setMale} readOnly />
                    </div>
                </div>

                <input type="button" className="SUPSubmitButton" onClick={doSignup} value="가입" />
                {/* button과 button사이에 공백을 주기 위함 */}
                {/* <div className="SUPBtnGap"></div> */}
                {/* <input type="button" className="SUPSubmitButton" onClick={goLogin} value="로그인" /> */}

            </div>
        </div>

    );

};