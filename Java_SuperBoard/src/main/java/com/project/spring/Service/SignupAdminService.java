package com.project.spring.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.spring.DAO.AdminDAO;
import com.project.spring.DAO.SignupDAO;
import com.project.spring.DTO.Gender;
import com.project.spring.Util.Encryptor;
import com.project.spring.Util.FormatPhoneNumber;
import com.project.spring.Util.RandomPassword;


@Service 
public class SignupAdminService {
	
	@Autowired private AdminDAO asr;
	@Autowired private SignupDAO sr;
	private int shift = 627;

	@Transactional
	public String doSignup(String userid, String password, String name, String birth, String mobile, String gender) {
		// TODO Auto-generated method stub
		String returnstr = "";
	
		try {
			
			int id = 0;
			long count = asr.count();
			int maxid = 0;
			Gender g = null;
			
			if(asr.findMaxId() == null) { // maxid는 내장함수가 아니라서 Repository에 선언 후 사용해야함
				maxid = 0;
			} else {
				maxid = asr.findMaxId();
			}
			
			if(count == 0) {
				id = 1;
			} else {
				id = maxid + 1;
			}
				
			if(gender.equals("남성")) {
				g = Gender.남성;
			} else {
				g = Gender.여성;
			}
			
			String pw = RandomPassword.generatePassword();
			String enpw = Encryptor.customEncrypt(pw, shift);
			
			if(sr.existsByMobile(mobile) || asr.existsByMobile(mobile)) {
				returnstr = "이미 등록된 휴대전화입니다.";
			} 
			String nm = FormatPhoneNumber.formatPhoneNumber(mobile);
			asr.doSignup(id,userid,enpw,name,birth,g,nm);
			
			returnstr = pw;
			
		} catch (NullPointerException e) {
		    returnstr = "입력값 중 누락된 항목이 있습니다.";
		} catch (DataIntegrityViolationException e) {
		    returnstr = "이미 등록된 휴대전화입니다.";
		} catch (Exception e) {
		    returnstr = "오류 발생(서버 오류)";
		}
		
		return returnstr;	
		
	}

}
