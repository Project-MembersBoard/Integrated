package com.project.spring.Scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.project.spring.DAO.AuthCodeMapper;

@Component
@EnableScheduling
public class AuthCodeScheduler {
	
	@Autowired private AuthCodeMapper acm;
	
	@Scheduled(fixedRate = 60000) // 1분마다 실행
    public void deleteExpiredAuthCodes() {
        acm.deleteExpiredCodes();
    }

}
