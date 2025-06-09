package com.project.spring.DTO;

import lombok.Data;

@Data
public class Statics {

	private int month;  // 월 (1월, 2월, ...)
    private int monthlyMemberCount;  // 월별 가입자 수
    private int monthlyPostCount;    // 월별 게시물 수
    private String maxViewPostTitle; // 최고 조회수 게시물 제목
    private String maxLikePostTitle; // 최고 좋아요 게시물 제목
    
}
