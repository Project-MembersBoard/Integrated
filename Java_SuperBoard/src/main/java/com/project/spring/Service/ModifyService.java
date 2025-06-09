package com.project.spring.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.spring.DAO.AdminDAO;
import com.project.spring.DAO.ModifyDAO;
import com.project.spring.DAO.SignupDAO;
import com.project.spring.DTO.Gender;
import com.project.spring.Util.Encryptor;
import com.project.spring.Util.FormatPhoneNumber;

@Service
public class ModifyService {
	
	private int shift = 627;
	@Autowired private ModifyDAO md;
	@Autowired private AdminDAO ad;
	@Autowired private SignupDAO sd;

	public String checkUser(String userid, String password, String name, LocalDateTime created) {
		// TODO Auto-generated method stub
		
		String returnstr = "";
		int count = 0;
		
		try {
			String enpw = Encryptor.customEncrypt(password, shift);
			
			count = md.checkUser(userid,enpw,name,created);
			
			if(count == 1) {
				returnstr = "";
			} else {
				returnstr = "비밀번호가 올바르지 않습니다.";
			}
		} catch(Exception e) {
			returnstr = "오류 발생(DB문제)";
		}
		
		return returnstr;
	}

	public String updateInfo(String userid, String password, String name, String mobile, String formattedDate,
			String email, String gender, LocalDateTime created) {
		// TODO Auto-generated method stub
		String returnstr = "";
		Gender g = null;
		
		if(gender.equals("남성")) {
			g = Gender.남성;
		} else {
			g = Gender.여성;
		}
		
		try {
			String enpw = Encryptor.customEncrypt(password, shift);
			md.updateInfo(userid,enpw,name,mobile,formattedDate,email,g,created);
		} catch(Exception e) {
			returnstr = "오류 발생(Update ERROR)";
		}
		
		return returnstr;
		
	}

	public String checkAdmin(String userid, String password, String name, LocalDateTime created) {
		// TODO Auto-generated method stub
		String returnstr = "";
		int count = 0;
		
		try {
			String enpw = Encryptor.customEncrypt(password, shift);
			
			count = md.checkAdmin(userid,enpw,name,created);
			
			if(count == 1) {
				returnstr = "";
			} else {
				returnstr = "비밀번호가 올바르지 않습니다.";
			}
		} catch(Exception e) {
			returnstr = "오류 발생(DB문제)";
		}
		
		return returnstr;
		
	}

	public String checkId(String userid) {
		// TODO Auto-generated method stub
		
		String returnstr = "";
		
		try {
			Integer userCount = sd.checkid(userid);
			Integer adminCount = ad.checkid(userid);
			
			if(userCount == null || adminCount == null) {
				returnstr = "오류 발생(Null Exception)";
			}
			
			if(userCount > 0 || adminCount > 0 || userCount < 0 || adminCount < 0) {
				returnstr = "해당 아이디는 이미 사용중입니다.";
			}
		} catch(Exception e) {
			returnstr = "오류 발생(DB Error)";
		}
		return returnstr;
	}

	public String checkMobile(String mobile) {
		// TODO Auto-generated method stub
		String returnstr = "";
		
		try {
			String formobile = FormatPhoneNumber.formatPhoneNumber(mobile);
			Integer userCount = sd.checkMobile(formobile);
			Integer adminCount = ad.checkMobile(formobile);
			
			if(userCount == null || adminCount == null) {
				returnstr = "오류 발생(Null Exception)";
			}
			
			if(userCount > 0 || adminCount > 0 || userCount < 0 || adminCount < 0) {
				returnstr = "해당 번호는 이미 사용중입니다.";
			}
		} catch(Exception e) {
			returnstr = "오류 발생(DB Error)";
		}
		return returnstr;
		
	}

	public String updateAdminInfo(String userid, String password, String name, String mobile, String formattedDate,
			String gender, LocalDateTime created) {
		// TODO Auto-generated method stub
		
		String returnstr = "";
		Gender g = null;
		
		if(gender.equals("남성")) {
			g = Gender.남성;
		} else {
			g = Gender.여성;
		}
		
		try {
			String enpw = Encryptor.customEncrypt(password, shift);
			md.updateAdminInfo(userid,enpw,name,mobile,formattedDate,g,created);
		} catch(Exception e) {
			returnstr = "오류 발생(Update ERROR)";
		}
		
		return returnstr;
	}

}
