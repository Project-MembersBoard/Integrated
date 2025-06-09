package com.project.spring.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.Service.MailService;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true") 
@RestController
@RequestMapping("/email")
public class EmailController {
	
	@Autowired private MailService mailService;

    @PostMapping("/sendMail") 
    public String sendCode(@RequestBody Map<String, String> req) {
    	
    	String returnstr;
    	
    	try {
    		String email = req.get("email");
    		if (!email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
    		    returnstr = "오류 발생(유효하지 않은 이메일 형식)";
    		}
    		
        	String cleanEmail = email.trim();
            returnstr = mailService.sendAuthCode(cleanEmail);
    	} catch(Exception e) {
    		returnstr = "오류 발생(값 전달 오류/전송)";
    	}
    	
    	return returnstr;
    }
    
    @PostMapping("/verify")
    public String verifyCode(@RequestBody Map<String, String> req) {
    	
    	String returnstr = "";
    	
    	try {
    		String email = req.get("email");
    		String code = req.get("code");
    		
    		if(email == null || email.trim().equals("")) {
    			returnstr = "오류 발생(이메일 형식 오류)";
    		} else {
    			returnstr = mailService.verifyCode(email,code);
    		}
    	} catch(Exception e) {
    		returnstr = "오류 발생(값 전달 오류/인증)";
    	}
    	
    	return returnstr;
    }

}
