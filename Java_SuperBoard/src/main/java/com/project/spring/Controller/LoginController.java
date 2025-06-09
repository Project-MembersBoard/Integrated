package com.project.spring.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.DAO.LoginDAO;
import com.project.spring.Service.LoginService;
import com.project.spring.Util.Encryptor;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true") 
@RestController
@RequestMapping("/login") 
public class LoginController {
	
	@Autowired private LoginService ls;
	@Autowired private LoginDAO ld;
	private int shift = 627;
	
	@PostMapping("/doLogin")
	public String doLogin(@RequestBody Map<String, String> req,HttpSession session) {
		
		String returnstr = "";
		
		String userid = req.get("userid");
        String password = req.get("password");
        String name = "";
        LocalDateTime created = null;
        String rawcreated = "";
        String enpw = Encryptor.customEncrypt(password, shift);

        if (userid == null || userid.isEmpty() || password == null || password.isEmpty()) {
            return "오류 발생(값 전달 오류)";
        }
		
		try {
			if(userid.trim().equals("admin")) {
				returnstr = ls.doAdminLogin(userid,password);
				if(returnstr.equals("1")) { //관리자 임시비밀번호로 로그인
					name = ld.getNameByAdmin(userid,enpw);
					rawcreated = ld.getCreatedByAdmin(userid,name);
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
					created = LocalDateTime.parse(rawcreated, formatter);
					session.setAttribute("Loginstatus", "admin");
					session.setAttribute("WhoLogin", userid);
					session.setAttribute("Whoname", name);
					session.setAttribute("created", created);
				} else { //관리자 임시비밀번호 아닐때
					name = ld.getNameByAdmin(userid,enpw);
					rawcreated = ld.getCreatedByAdmin(userid,name);
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
					created = LocalDateTime.parse(rawcreated, formatter);
					session.setAttribute("Loginstatus", "admin");
					session.setAttribute("WhoLogin", userid);
					session.setAttribute("Whoname", name);
					session.setAttribute("created", created);
				}
			} else {
				returnstr = ls.doLogin(userid, password);
				if(returnstr.equals("")) { //일반 사용자
					enpw = Encryptor.customEncrypt(password, shift);
					name = ld.getNameByUser(userid,enpw);
					rawcreated = ld.getCreatedByUser(userid,name);
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
					created = LocalDateTime.parse(rawcreated, formatter);
					session.setAttribute("Loginstatus", "user");
					session.setAttribute("WhoLogin", userid);
					session.setAttribute("Whoname", name);
					session.setAttribute("created", created);
				}
			}	
		} catch(Exception e) {
			e.printStackTrace();
			returnstr = "오류 발생(서버 내부 오류)";
	    }
		System.out.println((String)session.getAttribute("WhoLogin"));
		return returnstr;
	}
	
	@PostMapping("/getUser")
	   public Map<String, Object> getUser(HttpSession session) {
	      
	      Map<String, Object> result = new HashMap<>();

	       result.put("WhoLogin", session.getAttribute("WhoLogin"));
	       result.put("Whoname", session.getAttribute("Whoname"));
	       result.put("created", session.getAttribute("created"));
	       
	       System.out.println(result);

	       return result;
	   }
	
	@PostMapping("/checkLogin")
	public String checkLogin(HttpSession session) {

		String returnstr = "";
		
		try {
			
			returnstr = (String) session.getAttribute("Loginstatus");
			
		} catch(Exception e) {
			returnstr = "오류 발생(세션)";
		}
		return returnstr;
	}
	
	@PostMapping("/dologout")
	public String doLogout(HttpSession session) {
		
		String returnstr = "";
		
		try {
			session.invalidate();
			returnstr = "1";
		} catch(Exception e) {
			returnstr = "오류 발생(세션 제거 오류)";
		}
		
		return returnstr;
		
	}
    @GetMapping("/api/member/checkAuth")
    public ResponseEntity<Map<String, Object>> checkAuth(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        String loginStatus = (String) session.getAttribute("Loginstatus");
        String userId = (String) session.getAttribute("WhoLogin");
        
        boolean isLoggedIn = (loginStatus != null && (loginStatus.equals("user") || loginStatus.equals("admin")));
        
        response.put("isLoggedIn", isLoggedIn);
        if (isLoggedIn && userId != null) {
            response.put("userId", userId);
        }
        
        return ResponseEntity.ok(response);
    }
}

