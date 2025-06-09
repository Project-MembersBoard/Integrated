package com.project.spring.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.spring.DTO.Gender;

@Mapper 
public interface AdminDAO {

	long count();

	Integer findMaxId();

	boolean existsByMobile(@Param("mobile") String mobile);

	void doSignup(@Param("id") int id,@Param("userid") String userid,@Param("password") String pw,
					@Param("name") String name,@Param("birth") String birth,@Param("gender") Gender g,@Param("mobile") String nm);

	Integer checkid(@Param("userid") String userid);

	Integer checkMobile(@Param("mobile") String mobile);

}
