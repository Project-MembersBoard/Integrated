import { useNavigate } from "react-router-dom";

import './ModifyAdminPw.css';
import { useState } from "react";

const URL = process.env.REACT_APP_API_URL;
const Key = "aF9kL2pR8wXzT3Nh";

export default function ModifyAdminPw() {

    const navigate = useNavigate();

    const [newpw, setNewPw] = useState({npw:"",cpw:""});

    const setPw = (e) => {
        let {name, value} = e.target;
        setNewPw((prev) => ({...prev, [name]:value}));
    };

    const ModifyPassword = async (e) => {

        if(newpw.npw.trim() === '' || newpw.cpw.trim() === '') {
            alert("값을 모두 입력하십시오");
            return;
        }

        if(newpw.npw !== newpw.cpw) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if(newpw.npw === Key) {
            alert("해당 비밀번호는 사용 불가능합니다.");
            return;
        }

        if(newpw.npw.trim().length > 16 || /[!@#$%^&*(),.?":{}|<>]/.test(newpw.npw) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(newpw.npw)) {
            alert("해당 비밀번호는 사용 불가능합니다.");
            return;
        }

        try {
            const response = await fetch(`${URL}/modify/ChangePw`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({password:newpw.npw}),
                credentials: "include"
            });

            if(!response.ok) {
                throw new Error("서버 오류");
            }

            const result = await response.text();
            if(result === "") {
                alert("수정 성공!! 로그아웃 됩니다.");
                navigate('/');
            } else {
                alert(result);
            }

        } catch(error) {
            alert(error.message);
        }

    };

    const goHome = (e) => {
        navigate('/');
    };

    return(

        <div className="ModifyAdminPwEntireDiv">

            <p className="ModifyAdminPwHeaerMain" onClick={goHome}>Super Board</p>

            <div className="ModifyAdminPwPrintDiv">

                <p className="ModifyAdmiPwPrintHeaderSentence">비밀번호 변경</p>

                <p className="ModifyAdminPwMainSentence">
                    임시 비밀번호로 로그인하셨습니다.<br />
                    현재 비밀번호는 보안상 임시로 발급된 것으로<br />
                    다른 사용자와 공유되었을 가능성이 있습니다.<br />
                    안전한 계정 관리를 위해 지금 바로 새 비밀번호로 변경해 주세요.<br />
                    변경하지 않으면 일부 서비스 이용에 제한이 있을 수 있습니다.
                </p>

                <p className="ModifyAdminPwSubSentence">
                    비밀번호는 최대 16자리까지 가능합니다.<br />
                    비밀번호는 특수기호와 한글을 사용 불가능합니다.<br />
                    계정 보호를 위해 긴 비밀번호를 추천드립니다.
                </p>

                <table className="ModifyAdminPwMainTable">
                    <tbody>
                        <tr>
                            <td>
                                <label className="ModifyAdminPwMainTableLabel">새 비밀번호</label>
                            </td>
                            <td>
                                <input type="password" onChange={setPw} name="npw" value={newpw.npw} className="ModifyAdminPwMainTableInputText" />  
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="ModifyAdminPwMainTableLabel">비밀번호 확인</label>
                            </td>
                            <td>
                                <input type="password" onChange={setPw} name="cpw" value={newpw.cpw} className="ModifyAdminPwMainTableInputText" />  
                            </td>
                        </tr>
                    </tbody>
                </table>

                <input type="button" className="ModifyAdminPwBtn" onClick={ModifyPassword} value="비밀번호 변경" />
                <input type="button" className="ModifyAdminPwBtn" onClick={goHome} value="홈으로" />

            </div>

        </div>

    );

}