package com.project.spring.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.spring.DAO.FindIdandPasswordDAO;
import com.project.spring.Util.Encryptor;
import com.project.spring.Util.FormatPhoneNumber;

@Service
public class FindIdandPasswordService {
	
	@Autowired private FindIdandPasswordDAO fipdao;
	private int shift = 627;

	public String findId(String name, String mobile) {
		// TODO Auto-generated method stub
		
		String returnstr = "";
		
		try {
			String nm = FormatPhoneNumber.formatPhoneNumber(mobile);
			returnstr = fipdao.findId(name,nm);
		} catch(Exception e) {
			returnstr = "오류 발생(DB연결 오류)";
		}
		
		return returnstr;

	}

	public String checkAuth(String userid, String email) {
		// TODO Auto-generated method stub
		String returnstr = "";
		Integer count = 0;
		
		try {
			count = fipdao.checkAuth(userid, email);
			if(count == null || count == 0 || count > 1 || count < 0) {
				returnstr = "아이디 또는 이메일이 잘못되었습니다";
			} else if(count == 1) {
				returnstr = "";
			}
		} catch(Exception e) {
			returnstr = "오류 발생(DB연결 오류)";
		}
		return returnstr;
	}

	public String findPw(String userid, String cleanEmail) { 
		// TODO Auto-generated method stub
		String returnstr = "";
		String encryptPw = "";
		try {
			if(fipdao.findPw(userid, cleanEmail) == null || fipdao.findPw(userid, cleanEmail).equals("")) {
				returnstr = "오류 발생(값 존재 오류)";
			} else {
				encryptPw = fipdao.findPw(userid, cleanEmail);
				returnstr = Encryptor.customDecrypt(encryptPw, shift);
			}
		} catch(Exception e) {
			returnstr = "오류 발생(DB연결 오류)";
		}
		return returnstr;
	}

}
