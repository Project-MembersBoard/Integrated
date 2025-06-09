package com.project.spring.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.spring.DAO.SignupDAO;
import com.project.spring.DTO.Gender;
import com.project.spring.Util.Encryptor;
import com.project.spring.Util.FormatPhoneNumber;
import com.project.spring.Util.UserExistCheck;

@Service 
public class SignupService {
	
	@Autowired private SignupDAO sr;
	@Autowired private UserExistCheck uec;
	
	private int shift = 627;
	private static final Logger signupLogger = LoggerFactory.getLogger("com.project.signup");

	@Transactional
	public String doSignup(String userid, String password, String name, String birth, String mobile, String email,
			String gender) {
		// TODO Auto-generated method stub
		String returnstr = "";
		
		try {
			int id = 0;
			long count = sr.count();
			int maxid = 0;
			
			if(sr.findMaxId() == null) { // maxid는 내장함수가 아니라서 Repository에 선언 후 사용해야함
				maxid = 0;
			} else {
				maxid = sr.findMaxId();
			}
			
			if(count == 0) {
				id = 1;
			} else {
				id = maxid + 1;
			}
			
			Gender g = null;
				
			if(gender.equals("남성")) {
				g = Gender.남성;
			} else {
				g = Gender.여성;
			}
			
			String enpw = Encryptor.customEncrypt(password,shift);
			String nm = FormatPhoneNumber.formatPhoneNumber(mobile);
			
			if(email.equals("")) {
				String checkResult = uec.existCheckUser(userid, mobile);
				if(!checkResult.equals("")) {
					return checkResult;
				}
			} else {
				String checkResult = uec.existCheckUser(userid, email, mobile);
				if(!checkResult.equals("")) {
					return checkResult;
				}
			}
			
			signupLogger.info("회원가입 시도: 사용자명={} 아이디={}", name, userid);
			
			sr.doSignup(id,userid,enpw,nm,email,birth,g,name);
			
			signupLogger.info("회원가입 성공: 사용자명={}", name);
			
			returnstr = "";	
			
		} catch (NullPointerException e) {
		    returnstr = "입력값 중 누락된 항목이 있습니다.";
		    signupLogger.warn("회원가입 실패: 사용자명={}", name);
		} catch (DataIntegrityViolationException e) {
		    returnstr = "이미 등록된 아이디 또는 이메일 또는 휴대전화입니다.";
		    signupLogger.warn("회원가입 실패: 사용자명={}", name);
		} catch (Exception e) {
		    returnstr = "오류 발생(서버 오류)";
		    signupLogger.error("회원가입 중 오류 발생: 사용자명={}", name, e);
		}
		
		return returnstr;
		
	}

}
