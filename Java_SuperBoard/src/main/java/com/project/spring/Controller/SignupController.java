package com.project.spring.Controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.DAO.SignupDAO;
import com.project.spring.Service.SignupAdminService;
import com.project.spring.Service.SignupService;
import com.project.spring.Util.FormatPhoneNumber;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true") 
@RestController
@RequestMapping("/signup") 
public class SignupController {
	
	@Autowired private SignupDAO sd;
	@Autowired private SignupService ss;
	@Autowired private SignupAdminService sas;
	
	private String key = "aF9kL2pR8wXzT3Nh";
	
	@PostMapping("/doSignup")
	public String doSignup(@RequestBody Map<String, String> req) {
		
		String returnstr = ""; 
		
		try {

	        String userid = req.get("userid");
	        String password = req.get("password");
	        String email = req.get("email");
	        String name = req.get("name");
	        String birth = req.get("birth"); // try-catch로 감싸는 게 안전
	        String mobile = req.get("mobile");
	        String gender = req.get("gender");
	        String type = req.get("type");
	        
	        if (userid != null && !userid.isEmpty() &&
	            password != null && !password.isEmpty() &&
	            name != null && !name.isEmpty() &&
	            birth != null && !birth.isEmpty() &&
	            mobile != null && !mobile.isEmpty() &&
	            gender != null && !gender.isEmpty() && 
	            type != null) {
	        	
	        	if(type.equals("admin") && password.equals(key)) {
	        		returnstr = sas.doSignup(userid,password,name,birth,mobile,gender);
	        	} else {
	        		if(email != null && !email.isEmpty()) {
	        			returnstr = ss.doSignup(userid, password, name, birth, mobile, email, gender);
	        		}        		
	        	}          
	        } else {
	            returnstr = "오류 발생(값 전달 오류)";
	        }

	    } catch (Exception e) {
	        e.printStackTrace();
	        returnstr = "오류 발생(서버 내부 오류)";
	    }
		
		return returnstr;
	}
	
	@PostMapping("/checkUserid")
	public Map<String, Boolean> checkUserId(@RequestBody Map<String, String> req) {
		
		String userid = req.get("id");
		boolean available = !sd.existsByUserid(userid);
		
		return Collections.singletonMap("available", available);
	}
	
//	@PostMapping("/checkPassword")
//	public Map<String, Boolean> checkPassword(@RequestBody Map<String, String> req) {
//		
//		boolean available = false;
//		int count = 0;
//		String password = req.get("password");
//		count = sd.existsByPassword(password);
//		
//		return Collections.singletonMap("available", available);
//	}
//	
	@PostMapping("/checkEmail")
	public Map<String, Boolean> checkEmail(@RequestBody Map<String, String> req) {
		
		String email = req.get("email");
		boolean available = false;
		if(!email.equals("")) {
			available = !sd.existsByEmail(email);
		} else {
			available = true;
		}
		
		return Collections.singletonMap("available", available);
	}
	
	@PostMapping("/checkMobile")
	public Map<String, Boolean> checkMobile(@RequestBody Map<String, String> req) {
		
		String mobile = req.get("mobile");
		String enmobile = FormatPhoneNumber.formatPhoneNumber(mobile);
		boolean available = !sd.existsByMobile(enmobile);
		
		return Collections.singletonMap("available", available);
	}

}
