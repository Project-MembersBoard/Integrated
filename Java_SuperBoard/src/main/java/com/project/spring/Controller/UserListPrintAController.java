package com.project.spring.Controller;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.DAO.PrintBoardDAO;
import com.project.spring.DAO.SignupDAO;
import com.project.spring.DTO.PrintBoard;
import com.project.spring.DTO.Signup;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true") 
@RestController
@RequestMapping("/listprint") 
public class UserListPrintAController {
	
	@Autowired private SignupDAO sd;
	@Autowired private PrintBoardDAO bd;
	
	@PostMapping("/getuserlist")
	public ArrayList<Signup> getUserList() {
		
		ArrayList<Signup> as = new ArrayList<>();
		
		try {
			as = sd.getAllUser();
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		
		return as;
	}
	
	@PostMapping("/setSession")
	public String sendData(@RequestBody Map<String, String> req,HttpSession session) {
		String returnstr = "";
		
		try {
			String id = req.get("id");
			session.setAttribute("sendUser", id);
		} catch(Exception e) {
			returnstr = "오류 발생(SET Session Error)";
		}
		
		return returnstr;
		
	}
	
	@PostMapping("/getuserdata")
	public ArrayList<Signup> getUserData(HttpSession session) {
		
		ArrayList<Signup> as = new ArrayList<>();
		
		try {
			String id = (String)session.getAttribute("sendUser");
			as = sd.getUserData(id);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}

		return as;
		
	}
	
	@PostMapping("/getBoardList")
	public ArrayList<PrintBoard> getBoardList(HttpSession session) {
		
		ArrayList<PrintBoard> ab = new ArrayList<>();
		
		try {
			String id = (String)session.getAttribute("sendUser");
			String userid = sd.getUserid(id);
			ab = bd.getBoardList(userid);
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		
		return ab;
		
	}
	
	@PostMapping("/getFilterInfo")
	public ArrayList<Signup> getFilterInfo(@RequestBody Map<String, String> req) {
		
		int count = 0;
		ArrayList<Signup> sa = new ArrayList<>();
		
		try {
			String value = req.get("value");
			
			if(value.equals("")) {
				sa = sd.getAllUser();
			} else {
				count = sd.getFilterInfo(value);
				if(count > 0) {
					sa = sd.getFilterData(value);
				}
			} 
			
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		
		return sa;
		
	}

}
