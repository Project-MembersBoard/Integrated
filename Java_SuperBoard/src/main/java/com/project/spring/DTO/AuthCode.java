package com.project.spring.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AuthCode {
	
	private String email;
	private String code;
	private LocalDateTime created;

}
