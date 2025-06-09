package com.project.spring.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper 
public interface FindIdandPasswordDAO {

	String findId(@Param("name") String name,@Param("mobile") String mobile);

	int checkAuth(@Param("userid") String userid,@Param("email") String email);

	String findPw(@Param("userid") String userid,@Param("email") String cleanEmail);

}
