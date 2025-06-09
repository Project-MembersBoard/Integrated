package com.project.spring.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.spring.DAO.LoginDAO;
import com.project.spring.Util.Encryptor;

@Service 
public class LoginService {
	
	@Autowired private LoginDAO login;
	private int shift = 627;
	
	private static final Logger loginLogger = LoggerFactory.getLogger("com.project.login");

	public String doLogin(String userid, String password) {

		String returnstr = "";
		Integer count = 0;
		
		try {
			String enpw = Encryptor.customEncrypt(password, shift);
			loginLogger.info("로그인 시도: 아이디={}", userid);
			count = login.checkByUseridAndPassword(userid, enpw);
			if(count == null || count == 0) {
				returnstr = "아이디 또는 비밀번호가 올바르지 않습니다.";
				loginLogger.warn("로그인 실패: 아이디={}", userid);
			} else {
				loginLogger.info("로그인 성공: 아이디={}", userid);
				login.setLogin(userid);
				returnstr = "";
			}
		} catch (Exception e) {
		    returnstr = "오류 발생(서버 오류)";
		    loginLogger.error("로그인 중 오류 발생: 아이디={}", userid, e);
		}
		return returnstr; 
	}

	public String doAdminLogin(String userid, String password) {

		String returnstr = "";
		String enpw = Encryptor.customEncrypt(password, shift);
		Integer count = 0;
		
		try {
			if(login.checkFirst(enpw) == true) {
				count = login.checkAdminByUseridAndPassword(userid, enpw);
				login.setAdminLogin(userid, enpw);
				returnstr = "1";
			} else {
				count = login.checkAdminByUseridAndPassword(userid, enpw);
				login.setAdminLogin(userid, enpw);
				returnstr = "0";
			}
			if(count == 0 || count == null) {
				returnstr = "아이디 또는 비밀번호가 올바르지 않습니다.";
			}
			
		} catch (Exception e) {
		    returnstr = "오류 발생(서버 오류)";
		}
		return returnstr;

	}

}
