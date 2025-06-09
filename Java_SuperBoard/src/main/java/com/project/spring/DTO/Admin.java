package com.project.spring.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Admin {
	
	private int id;
	private String userid;
	private String password;
	private String name;
	private String birth;
	private Gender gender;
	private String mobile;
	private LocalDateTime created;
	private LocalDateTime updated;

}
