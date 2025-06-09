package com.project.spring.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.Service.FindIdandPasswordService;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true") 
@RestController
@RequestMapping("/fip")
public class FindIdandPasswordController {
	
	@Autowired private FindIdandPasswordService fips;
	
	@PostMapping("/findid")
	public String findId(@RequestBody Map<String, String> req) {
		
		String returnstr = "";
		
		try {
			
			String name = req.get("name");
			String mobile = req.get("mobile");
			
			if(name.equals("") || mobile.equals("") || name == null || mobile == null) {
				returnstr = "오류 발생(Value null or blank)";
			}
			
			returnstr = fips.findId(name, mobile);
			
		} catch(Exception e) {
			returnstr = "오류 발생(값 오류)";
		}
		
		return returnstr;
		
	} 
	
	@PostMapping("/findpw") 
	public String findPw(@RequestBody Map<String, String> req) {
		
		String returnstr = "";
		
		try {
			String userid = req.get("userid");
			String email = req.get("email");
			
			if (!email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
    		    returnstr = "오류 발생(유효하지 않은 이메일 형식)";
    		}
			String cleanEmail = email.trim();
			returnstr = fips.findPw(userid, cleanEmail);
		} catch(Exception e) {
			returnstr = "오류 발생(값 이상 오류)";
		}
		
		return returnstr;
		
	}
	
	@PostMapping("/checkAuth") 
	public String checkId(@RequestBody Map<String, String> req) {
		
		String returnstr = "";
		
		try {
			String userid = req.get("userid");
			String email = req.get("email");
			
			if (!email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
    		    returnstr = "오류 발생(유효하지 않은 이메일 형식)";
    		}
			String cleanEmail = email.trim();
			returnstr = fips.checkAuth(userid, cleanEmail);
		} catch(Exception e) {
			returnstr = "오류 발생(값 이상 오류)";
		}
		
		return returnstr;
	}

}
