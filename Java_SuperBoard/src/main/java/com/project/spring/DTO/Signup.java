package com.project.spring.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Signup {
	
	private int id;
	private String userid;
	private String password;
	private String name;
	private String birth;
	private String email;
	private Gender gender;
	private Status status;
	private String mobile;
	private LocalDateTime created;
	private LocalDateTime updated;
	
}
