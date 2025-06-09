package com.project.spring.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

import com.project.spring.DAO.AuthCodeMapper;
import com.project.spring.DTO.AuthCode;

@Service
public class MailService {
	
	@Autowired private JavaMailSender mailSender;

    @Autowired private AuthCodeMapper acm;

    public String sendAuthCode(String email) {
    	
    	String returnstr = "";
    	
    	try { 
    		
    		// 1.기존 이메일 데이터 삭제
        	acm.deleteByEmail(email);
        	
            // 2. 인증 코드 생성
            String authCode = generateCode();

            // 3. 이메일 발송
            SimpleMailMessage message = new SimpleMailMessage();
            String mailText = ""
            	    + "안녕하세요.\n\n"
            	    + "회원가입을 진행해주셔서 감사합니다.\n"
            	    + "아래의 인증 코드를 입력하시면 이메일 인증이 완료됩니다.\n\n"
            	    + "----------------------------------\n"
            	    + "📌 인증 코드: " + authCode + "\n"
            	    + "----------------------------------\n\n"
            	    + "해당 인증 코드는 보안을 위해 5분간만 유효합니다.\n"
            	    + "만약 본인이 요청하지 않은 경우 이 이메일을 무시해 주세요.\n\n"
            	    + "감사합니다.\n"
            	    + "- [Super Board] 드림 -\n\n"
            	    + "==================================\n\n"
            	    + "Hello,\n\n"
            	    + "Thank you for signing up.\n"
            	    + "Please enter the verification code below to complete your email verification.\n\n"
            	    + "----------------------------------\n"
            	    + "📌 Verification Code: " + authCode + "\n"
            	    + "----------------------------------\n\n"
            	    + "This verification code is valid for 5 minutes for security reasons.\n"
            	    + "If you did not request this email, please disregard it.\n\n"
            	    + "Thank you.\n"
            	    + "- From [Super Board]\n\n"
            	    + "───────────────────────────────────────\n"
            	    + "ⓒ 2025 YourCompany. All rights reserved.\n"
            	    + "고객센터: support@yourcompany.com | 010-1234-5678\n"
            	    + "주소: 서울 서초구 서초동 1318-2  8층\n"
            	    + "───────────────────────────────────────";
            
            message.setTo(email);
            message.setSubject("[이메일 인증] 인증 코드 발송");
            message.setText(mailText);
            mailSender.send(message);

            // 4. DB 저장
            AuthCode dto = new AuthCode();
            dto.setEmail(email);
            dto.setCode(authCode);
            dto.setCreated(LocalDateTime.now());

            acm.insertAuthCode(dto);
    		
    	} catch(Exception e) {
    		returnstr = "오류 발생(이메일 전달 오류)";
    	}
    	return returnstr;
        
    }

    private String generateCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000); // 6자리 숫자
    }

	public String verifyCode(String email, String code) {
		// TODO Auto-generated method stub
		
		String returnstr = "";
		int count = 0;
		
		try {
			count = acm.verifyCode(email,code);
			if(count == 1) {
				returnstr = "";
			} else {
				returnstr = "인증번호가 올바르지 않습니다.";
			}
		} catch(Exception e) {
			System.out.println(e.getMessage());
			returnstr = "오류 발생(인증 오류)";
		}
		
		return returnstr;
		
	}

}
