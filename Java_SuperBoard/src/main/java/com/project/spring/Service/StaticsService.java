package com.project.spring.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.spring.DAO.StaticsDAO;
import com.project.spring.DTO.Statics;

@Service
public class StaticsService {

	@Autowired private StaticsDAO staticsMapper;

    public List<Statics> getMonthlyStatics(String year) {
    	
        List<Statics> monthlyStatics = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
        	
            String yearMonth = year + String.format("-%02d", month);

            Statics dto = new Statics();
            dto.setMonth(month);

            // 월별 가입자 수
            dto.setMonthlyMemberCount(staticsMapper.getMonthlyMemberCount(yearMonth));
            // 월별 게시물 수
            dto.setMonthlyPostCount(staticsMapper.getMonthlyPostCount(yearMonth));
            // 월별 최고 조회수 게시물 제목
            dto.setMaxViewPostTitle(staticsMapper.getMonthlyMaxViewPostTitle(yearMonth));
            // 월별 최고 좋아요 게시물 제목
            dto.setMaxLikePostTitle(staticsMapper.getMonthlyMaxLikePostTitle(yearMonth));

            monthlyStatics.add(dto);
        }

        return monthlyStatics;
    }

}
