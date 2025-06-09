package com.project.spring.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.DAO.SignupDAO;
import com.project.spring.DTO.Signup;
import com.project.spring.DTO.Status;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true") 
@RestController
@RequestMapping("/etc") 
public class ETCController {
	
	@Autowired private SignupDAO sd;
	
	@PostMapping("/stopAccounts")
	public ResponseEntity<?> stopAccounts(@RequestBody Map<String, List<Integer>> req) {
		
		try {	
			List<Integer> ids = req.get("ids");
		    sd.stopAccounts(ids);
		    
		    return ResponseEntity.ok().build();	
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("사용자 정지 중 오류가 발생했습니다.");
		}
	 
	}
	
	@PostMapping("/activateAccounts")
	public ResponseEntity<?> activateAccounts(@RequestBody Map<String, List<Integer>> req) {
	    try {
	        List<Integer> ids = req.get("ids");
	        sd.activateAccounts(ids);  // 서비스 계층에서 사용자 상태를 활성화로 업데이트
	        
	        return ResponseEntity.ok().build();  // 정상 처리 시 200 OK 반환
	    } catch (Exception e) {
	        e.printStackTrace();
	        System.out.println(e.getMessage());
	        
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("사용자 활성화 중 오류가 발생했습니다.");
	    }
	}
	
	@PostMapping("/filterUsers")
	public ArrayList<Signup> getUserList(@RequestBody Map<String, String> req) {
		
		ArrayList<Signup> as = new ArrayList<>();
		Status st = null;
		
		try {
			String status = req.get("status");
			
			// 선택한게 모두라는 option이라면
			if(status.equals("all")) {
				as = sd.getAllUser();
			} else if(status.equals("활성화")) {
				st = st.활성화;
				as = sd.getFillterUser(st);
			} else if(status.equals("정지")) {
				st = st.정지;
				as = sd.getFillterUser(st);
			} 
		
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		
		return as;
	}
	
	@PostMapping("/checkUserStatus")
	public String checkUserStatus(HttpSession session) {
		
		String returnstr = "";
		
		try {
			
			String userid = (String) session.getAttribute("WhoLogin");		
			returnstr = sd.checkStatus(userid);
			
		} catch (Exception e) {
			returnstr = "오류발생";
		}
		
		return returnstr;		
	}

}
