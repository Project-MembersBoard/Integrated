import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import './Layout.css';

const URL = process.env.REACT_APP_API_URL; 

export default function Layout() {
    
    const location = useLocation(); 
    const navigate = useNavigate();
    const [LoginStatus, setLoginStatus] = useState(false);
    const [usertype, setUsertype] = useState(false); // true면 admin false면 user

    const checkLogin = async() => {

        setLoginStatus(false);
        setUsertype(false);

        try {
            const response = await fetch(`${URL}/login/checkLogin`,
                {
                    method:"POST",
                    credentials:"include",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({}),
                }
            ) 
            const text = await response.text();
            if(text === "admin") {
                setLoginStatus(true);
                setUsertype(true);
            } else if(text === "user") {
                setLoginStatus(true);
                setUsertype(false);
            } else {
                setLoginStatus(false);
                //navigate('/login');
            }
        } catch(error) {
            alert(error.message);
            return;
        }
    };

    useEffect(() => {
        setLoginStatus(false);
        setUsertype(false);
        checkLogin();
    }, []);

    const goLogin = (e) => {
        e.preventDefault();
        navigate('/login', { state: { from: location.pathname } });
    };

    const Logout = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch(`${URL}/login/dologout`,
                {
                    method:"POST",
                    credentials:"include",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({}),
                }
            ) 
            if(response.ok) {
                const data = await response.text();
                if(data === "1") {
                    setLoginStatus(false);
                    setUsertype(false);
                    navigate('/'); 
                } else {
                    alert("오류 발생(서버 내부 오류)");
                    return;
                }
                
            }
        } catch(error) {
            alert(error.message);
        }

    };

    const goSignup = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

    const goModify = (e) => {
        e.preventDefault();
        navigate('/beforemodify');
    };

    const temp = (e) => {
        e.preventDefault();
        navigate('/modify');
    };

    const goUserPrint = (e) => {
        e.preventDefault();
        navigate('/userinfoprint');
    };

    const goUserStatics = (e) => {
        e.preventDefault();
        navigate('/userstatics');
    }

    const goAdminModify = (e) => {
        navigate('/goAdminModify');
    };

    return(
        <>
            <nav className="NavigateDIV">

                <ul className="uldiv">

                    <li id="HomeImg">
                        {LoginStatus ? <Link to="/" id="Himg">❤️</Link> : <Link to="/" id="Himg">❤️</Link>} 
                    </li>
                    <li id="LoginDiv">
                        {LoginStatus ? <a href="/loginhome" className="log" onClick={Logout}>로그아웃</a> : <a href="/login" className="log" onClick={goLogin}>로그인</a>}
                    </li>
                    <li id="SignupDiv">
                        {LoginStatus ? (
                            usertype ? (
                            <a href="/modifyadmininfo" className="modify" onClick={goAdminModify}>관리자정보수정</a>
                            ) : (
                            <a href="/membermodify" className="modify" onClick={goModify}>회원정보수정</a>
                            )
                        ) : (
                            <a href="/signup" className="modify" onClick={goSignup}>회원가입</a>
                        )}
                    </li> 
                    <li>
                       <Link to="/board/list" className="log">게시판</Link>
                    </li>
                    <li id="ETCDiv">
                     {usertype ? ( <Link to="/admin/page" className="log">관리자기능</Link> ) : ( <p></p> )}
                    </li>

                </ul>

            </nav>

            <Outlet context={{ isAdmin: usertype }} />
        </>
    );

}