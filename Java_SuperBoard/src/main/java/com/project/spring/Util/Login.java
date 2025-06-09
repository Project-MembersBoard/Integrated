package com.project.spring.Util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.stereotype.Component;

import com.project.spring.DAO.LoginDAO;

@Component
public class Login {
	
	@Autowired private LoginDAO lr;
	private int shift = 627;
	
	public String doLogin(String userid, String password) {
		
		String returnstr = "";
		
		try {
			String enpw = Encryptor.customEncrypt(password, shift);
			int count = lr.checkByUseridAndPassword(userid, enpw);
			
			if(count == 1) {
				returnstr = "";
			} else {
				returnstr = "아이디 또는 비밀번호가 틀립니다.";
			}
			
		} catch (IncorrectResultSizeDataAccessException e) {
		    returnstr = "오류 발생(데이터 반환 오류)";
		} catch (Exception e) {
		    returnstr = "오류 발생(서버 오류)";
		}
		
		return returnstr;
		
	}

}
