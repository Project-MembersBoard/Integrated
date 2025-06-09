package com.project.spring.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.DAO.ModifyDAO;
import com.project.spring.DTO.Signup;
import com.project.spring.Service.ModifyService;
import com.project.spring.Util.Encryptor;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true") 
@RestController
@RequestMapping("/modify") 
public class ModifyController {
	
	@Autowired private ModifyService ms;
	@Autowired private ModifyDAO md;
	private int shift = 627;
	
	@PostMapping("/checkUser")
	public String checkUser(@RequestBody Map<String, String> req) {
		
		String returnstr = "";
		
		String password = req.get("password");
		String userid = req.get("WhoLogin");
		String name = req.get("Whoname");
		LocalDateTime created = LocalDateTime.parse(req.get("created"));

		if(password == null || password.equals("") || userid == null || userid.equals("")) {
			returnstr = "오류 발생(Value Null Exception)";
		}
		try {
			returnstr =ms.checkUser(userid, password,name,created);
		} catch(Exception e) {
			returnstr = "오류 발생(DB문제)";
		}
		
		return returnstr;
		
	}
	
	@PostMapping("/checkAdmin")
	public String checkAdmin(@RequestBody Map<String, String> req) {
		
		String returnstr = "";
		
		String password = req.get("password");
		String userid = req.get("WhoLogin");
		String name = req.get("Whoname");
		LocalDateTime created = LocalDateTime.parse(req.get("created"));

		if(password == null || password.equals("") || userid == null || userid.equals("")) {
			returnstr = "오류 발생(Value Null Exception)";
		}
		try {
			returnstr =ms.checkAdmin(userid, password,name,created);
		} catch(Exception e) {
			returnstr = "오류 발생(DB문제)";
		}
		
		return returnstr;
		
	}
	
	@PostMapping("/getUserData")
	public ResponseEntity<Signup> getUserData(HttpSession session) {
		 
		Signup user = null;
		String rawPassword = "";
		
		try {
//			String userid = (String)session.getAttribute("WhoLogin");
			String name = (String)session.getAttribute("Whoname");
			System.out.println(name);
			LocalDateTime created = (LocalDateTime) session.getAttribute("created");
			System.out.println(created);
			user = md.getUserData(name,created);
			rawPassword = Encryptor.customDecrypt(user.getPassword(),shift);
			user.setPassword(rawPassword);
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(user);
		
	}
	
	@PostMapping("/getAdminData")
	public ResponseEntity<Signup> getAdminData(HttpSession session) {
		 
		Signup user = null;
		String rawPassword = "";
		
		try {
//			String userid = (String)session.getAttribute("WhoLogin");
			String name = (String)session.getAttribute("Whoname");
			System.out.println(name);
			LocalDateTime created = (LocalDateTime) session.getAttribute("created");
			System.out.println(created);
			user = md.getAdminData(name,created);
			rawPassword = Encryptor.customDecrypt(user.getPassword(),shift);
			user.setPassword(rawPassword);
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(user);
		
	}
	
	@PostMapping("/checkId")
	public String checkId(@RequestBody Map<String, String> req) {
		
		String returnstr = "";
		
		try {
			String userid = req.get("id");
			
			if(userid == null || userid.equals("")) {
				returnstr = "오류 발생(Null Exception)";
			}
			
			returnstr = ms.checkId(userid);
			
		} catch(Exception e) {
			returnstr = "오류 발생(Check Id Error)";
		}
		
		return returnstr;
		
	}
	
	@PostMapping("/checkMobile")
	public String checkMobile(@RequestBody Map<String, String> req) {
		
		String returnstr = "";
		
		try {
			String mobile = req.get("mobile");
			
			if(mobile == null || mobile.equals("")) {
				returnstr = "잘못된 접근입니다";
			}
			
			returnstr = ms.checkMobile(mobile);
			System.out.println(returnstr);
			
		} catch(Exception e) {
			returnstr = "오류 발생(Mobile Value Error)";
		}
		
		return returnstr;
		
	}
	
	@PostMapping("/updateInfo")
	public String updateInfo(@RequestBody Map<String, Object> req,HttpSession session) {
		
		String returnstr = "";
		
		try {
			String userid = (String)req.get("userid");
			String password = (String)req.get("password");
			String name = (String)req.get("name");
			String mobile = (String)req.get("mobile");
			String originalDate = (String)req.get("birth");
			String formattedDate = originalDate.replace("/", "");
			String email = (String)req.get("email");
			String gender = (String)req.get("gender");
			String createtime = (String)req.get("created");
			LocalDateTime created = LocalDateTime.parse(createtime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

			returnstr = ms.updateInfo(userid,password,name,mobile,formattedDate,email,gender,created);
			if(returnstr.equals("")) {
				session.invalidate();
			}
		} catch(Exception e) {
			returnstr = "오류 발생(값 전달 오류)";
		}
		
		return returnstr;
		
	}
	
	@PostMapping("/updateAdminInfo")
	public String updateAdminInfo(@RequestBody Map<String, Object> req,HttpSession session) {
		
		String returnstr = "";
		
		try {
			String userid = (String)req.get("userid");
			String password = (String)req.get("password");
			String name = (String)req.get("name");
			String mobile = (String)req.get("mobile");
			String originalDate = (String)req.get("birth");
			String formattedDate = originalDate.replace("/", "");
			String gender = (String)req.get("gender");
			String createtime = (String)req.get("created");
			LocalDateTime created = LocalDateTime.parse(createtime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

			returnstr = ms.updateAdminInfo(userid,password,name,mobile,formattedDate,gender,created);
			if(returnstr.equals("")) {
				session.invalidate();
			}
		} catch(Exception e) {
			returnstr = "오류 발생(값 전달 오류)";
		}
		
		return returnstr;
		
	}
	
	@PostMapping("/deleteUser")
	public String deleteUserInfo(@RequestBody Map<String, Object> req,HttpSession session) {
		
		String returnstr = "";
		try {
			String userid = (String)req.get("userid");
			md.deleteUserData(userid);
			session.invalidate();
		} catch(Exception e) {
			returnstr = "오류 발생(Delete Exception)";
		}
		
		return returnstr;
	}
	
	@PostMapping("/deleteAdmin")
	public String deleteAdminInfo(@RequestBody Map<String, Object> req,HttpSession session) {
		
		String returnstr = "";
		try {
			String userid = (String)req.get("userid");
			String createtime = (String)req.get("created");
			LocalDateTime created = LocalDateTime.parse(createtime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
			md.deleteAdminData(userid,created);
			session.invalidate();
		} catch(Exception e) {
			returnstr = "오류 발생(Delete Exception)";
		}
		
		return returnstr;
	}
	
	@PostMapping("/ChangePw")
	public String modifyPw(@RequestBody Map<String, String> req,HttpSession session) {
		
		String returnstr = "";
		
		try {
			String name = (String)session.getAttribute("Whoname");
			LocalDateTime created = (LocalDateTime)session.getAttribute("created");
			String password = req.get("password");
			String enpw = Encryptor.customEncrypt(password, shift);
			md.updatePw(enpw,name,created);
			session.invalidate();
		} catch(Exception e) {
			returnstr = "오류 발생(Update Error)";
		}
		
		return returnstr;
		
	}

}
