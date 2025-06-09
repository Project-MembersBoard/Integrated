package com.project.spring.Util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.project.spring.DAO.SignupDAO;

@Component
public class UserExistCheck {
	
	@Autowired SignupDAO sr;
	
	public String existCheckUser(String userid, String email, String mobile) {
		
        if (sr.existsByUserid(userid)) {
            return "이미 사용중인 아이디입니다";
        } else if (sr.existsByEmail(email)) {
            return "이미 사용중인 이메일입니다";
        } else if (sr.existsByMobile(mobile)) {
            return "이미 사용중인 휴대폰번호입니다";
        }
        
        return ""; // 유효성 통과
    }
	
	public String existCheckUser(String userid, String mobile) {
		
        if (sr.existsByUserid(userid)) {
            return "이미 사용중인 아이디입니다";
        } else if (sr.existsByMobile(mobile)) {
            return "이미 사용중인 휴대폰번호입니다";
        }
        
        return ""; // 유효성 통과
    }

}
