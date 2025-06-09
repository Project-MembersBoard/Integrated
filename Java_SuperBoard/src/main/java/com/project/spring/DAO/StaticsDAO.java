package com.project.spring.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper 
public interface StaticsDAO {

	int getMonthlyMemberCount(@Param("yearMonth") String yearMonth);

	int getMonthlyPostCount(@Param("yearMonth") String yearMonth);

	String getMonthlyMaxViewPostTitle(@Param("yearMonth") String yearMonth);

	String getMonthlyMaxLikePostTitle(@Param("yearMonth") String yearMonth);

}
