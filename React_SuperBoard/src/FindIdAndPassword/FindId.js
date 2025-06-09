import { useState } from "react";
import { useNavigate } from "react-router-dom";

import './FindId.css';

const URL = process.env.REACT_APP_API_URL;

export default function FindId() {

    const navigate = useNavigate();
    const [findidvalue, setFindIdValue] = useState({name:"", mobile:""});

    const doChange = (e) => {
        let {name, value} = e.target;
        setFindIdValue((prev) => ({...prev, [name]:value}));
    };

    const getFindId = async (e) => {

        const name = findidvalue.name;
        const mobile = findidvalue.mobile
        const regex = /^010\d{8}$/;

        if(name === "" || name === null || mobile === "" || mobile === null) {
            alert("모든 값을 다 입력하십시오.");
            return;
        }

        if(/[!@#$%^&*(),.?":{}|<>]/.test(name) || /\d/.test(name) 
           || name.trim().length > 32 || !/^[가-힣]+$/.test(name)) {
            alert("정확한 이름을 입력하십시오.");
            return;
        }

        if(mobile.trim().length > 24 || mobile.trim().length < 11 || /[ㄱ-ㅎㅏ-ㅣ]/.test(mobile) ||
           /^[A-Za-z]+$/.test(mobile) || !/^[0-9-]+$/.test(mobile) || !regex.test(mobile)) {
            alert("정확한 번호를 입력하십시오.");
            return;
        }

        try {
            const response = await fetch(`${URL}/fip/findid`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(findidvalue),
                credentials: "include"
            });

            if(!response.ok) {
                throw new Error("서버 오류");
            }

            const result = await response.text();
            if(result.trim() === "" || result.trim().startsWith("오")) {
                alert(result); 
            } else {
                alert("아이디는 " + result + "입니다.");
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

    return(

        <div className="LFIEtireDiv">

            <label className="LFIHeaderTableLabel">아이디 찾기</label>

            {/* <table className="LFIHeaderTable">
                <tbody>
                    <tr>
                        <td>
                            <label className="LFIHeaderTableLabel">아이디 찾기</label>
                        </td>
                    </tr>
                </tbody>
            </table> */}

            <div className="LFICenterPrintDiv">

                <label className="LFICenterPrintDivh3">회원정보에 등록한 휴대전화로 인증</label>
                <br />
                <label className="LFICenterPrintDivh4">회원정보에 등록한 휴대전화 번호와 입력한<br />휴대전화 번호가 같아야 인증번호를 받을 수 있습니다.</label>

                <table className="LFICenterTable">
                    <tbody>
                        <tr>
                            <td>
                                <label className="LFICenterTableLabel">이름</label>
                            </td>
                            <td>
                                <input type="text" autoComplete="off" name="name" onChange={doChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="LFICenterTableLabel">휴대전화</label>
                            </td>
                            <td>
                                <input type="text" autoComplete="off" name="mobile" onChange={doChange} placeholder="휴대전화(-빼고)"/>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <input type="button" className="LFIBtn" value="아이디 찾기" onClick={getFindId} />
                <input type="button" className="LFIBtn" value="로그인" onClick={goLogin} />
                <input type="button" className="LFIBtn" value="홈으로" onClick={goHome} />
            
            </div>

        </div>
    );

}