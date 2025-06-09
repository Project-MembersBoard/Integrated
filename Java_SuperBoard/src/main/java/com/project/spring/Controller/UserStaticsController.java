package com.project.spring.Controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.DAO.PrintBoardDAO;
import com.project.spring.DAO.SignupDAO;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true") 
@RestController
@RequestMapping("/statics") 
public class UserStaticsController {
	
	@Autowired SignupDAO sd;
	@Autowired PrintBoardDAO bd;
	
	private static final String LOG_FILE_PATH_SIGNUP = "logs/signup.log";
    private static final String LOG_FILE_PATH_LOGIN = "logs/login.log";
	
	@PostMapping("/getStaticsData")
	public ResponseEntity<Map<String, Integer>> getStaticsData() {
		
		Map<String, Integer> statistics = new HashMap<>();
		
		int dmc = 0; // 일별 가입자 통계
		int mmc = 0; // 월별 가입자 통계
		int ymc = 0; // 연도별 가입자 통계

		int dpc = 0; // 일별 게시물 통계
		int mpc = 0; // 월별 게시물 통계
		int ypc = 0; // 연도별 게시물 통계

		int dmv = 0; // 일별 최고 조회수
		int mmv = 0; // 월별 최고 조회수
		int ymv = 0; // 연도별 최고 조회수

		int dml = 0; // 일별 최고 좋아요
		int mml = 0; // 월별 최고 좋아요
		int yml = 0; // 연도별 최고 좋아요

		try {
		    // 가입자 수 통계
		    dmc = (sd.getDayUserCount() != null) ? sd.getDayUserCount() : 0;
		    mmc = (sd.getMonthUserCount() != null) ? sd.getMonthUserCount() : 0;
		    ymc = (sd.getYearUserCount() != null) ? sd.getYearUserCount() : 0;
		    
		    // 게시물 통계
		    dpc = (bd.getDayBoardCount() != null) ? bd.getDayBoardCount() : 0;
		    mpc = (bd.getMonthBoardCount() != null) ? bd.getMonthBoardCount() : 0;
		    ypc = (bd.getYearBoardCount() != null) ? bd.getYearBoardCount() : 0;
		    
		    // 조회수 통계
		    dmv = (bd.getDayHitCount() != null) ? bd.getDayHitCount() : 0;
		    mmv = (bd.getMonthHitCount() != null) ? bd.getMonthHitCount() : 0;
		    ymv = (bd.getYearHitCount() != null) ? bd.getYearHitCount() : 0;
		    
		    // 좋아요 통계
		    dml = (bd.getDayLikedCount() != null) ? bd.getDayLikedCount() : 0;
		    mml = (bd.getMonthLikedCount() != null) ? bd.getMonthLikedCount() : 0;
		    yml = (bd.getYearLikedCount() != null) ? bd.getYearLikedCount() : 0;
		    

		    statistics.put("dailyMemberCount", dmc);
	        statistics.put("monthlyMemberCount", mmc);
	        statistics.put("yearlyMemberCount", ymc);

	        statistics.put("dailyPostCount", dpc);
	        statistics.put("monthlyPostCount", mpc);
	        statistics.put("yearlyPostCount", ypc);

	        statistics.put("dailyMaxView", dmv);
	        statistics.put("monthlyMaxView", mmv);
	        statistics.put("yearlyMaxView", ymv);

	        statistics.put("dailyMaxLike", dml);
	        statistics.put("monthlyMaxLike", mml);
	        statistics.put("yearlyMaxLike", yml);

		} catch (Exception e) {
		    // 예외 처리 코드 추가 (필요한 경우)
		    e.printStackTrace();
		}
		
		return ResponseEntity.ok(statistics);
		
	}
	
	@PostMapping("/logs") 
	public Map<String, String> getLogs() throws IOException {
		
        Map<String, String> logs = new HashMap<>();
        
        try {
            byte[] signupBytes = Files.readAllBytes(Paths.get(LOG_FILE_PATH_SIGNUP));
            byte[] loginBytes = Files.readAllBytes(Paths.get(LOG_FILE_PATH_LOGIN));

            // UTF-8 인코딩으로 바이트 배열을 문자열로 변환
            String signupLogs = new String(signupBytes, StandardCharsets.UTF_8);
            String loginLogs = new String(loginBytes, StandardCharsets.UTF_8);

            logs.put("signup", signupLogs);
            logs.put("login", loginLogs);

        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return logs;
        
    }

}
