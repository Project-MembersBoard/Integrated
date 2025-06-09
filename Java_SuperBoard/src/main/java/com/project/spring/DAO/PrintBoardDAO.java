package com.project.spring.DAO;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.spring.DTO.PrintBoard;

@Mapper 
public interface PrintBoardDAO {

	ArrayList<PrintBoard> getBoardList(@Param("userid") String userid);

	Integer getDayBoardCount();

	Integer getMonthBoardCount();

	Integer getYearBoardCount();

	Integer getDayHitCount();

	Integer getMonthHitCount();

	Integer getYearHitCount();

	Integer getDayLikedCount();

	Integer getMonthLikedCount();

	Integer getYearLikedCount();

}
