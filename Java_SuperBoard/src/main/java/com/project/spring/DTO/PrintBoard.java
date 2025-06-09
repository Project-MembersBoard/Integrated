package com.project.spring.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PrintBoard {
	
	private int id;
	private String title;
	private String content;
	private String writer;
	private String category;
	private String tag;
	private String hit;
	private String liked;
	private LocalDateTime created;
	private LocalDateTime updated;

}
