package com.project.spring.DAO;

import java.time.LocalDateTime;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.spring.DTO.Gender;
import com.project.spring.DTO.Signup;

@Mapper 
public interface ModifyDAO {

	int checkUser(@Param("userid") String userid,@Param("password") String enpw,@Param("name") String name,@Param("created") LocalDateTime created);

	Signup getUserData(@Param("name") String name,@Param("created") LocalDateTime created);

	void updateInfo(@Param("userid") String userid,@Param("password") String enpw,
					  @Param("name") String name,@Param("mobile") String mobile,
					  @Param("birth") String formattedDate,@Param("email") String email,
					  @Param("gender") Gender gender, @Param("created") LocalDateTime created);

	void deleteUserData(@Param("userid") String userid);

	void updatePw(@Param("password") String enpw,@Param("name") String name,@Param("created") LocalDateTime created);

	int checkAdmin(@Param("userid") String userid,@Param("password") String enpw,@Param("name") String name,@Param("created") LocalDateTime created);

	Signup getAdminData(@Param("name") String name,@Param("created") LocalDateTime created);

	void updateAdminInfo(@Param("userid") String userid,@Param("password") String enpw,
					  @Param("name") String name,@Param("mobile") String mobile,
					  @Param("birth") String formattedDate, @Param("gender") Gender gender,
					  @Param("created") LocalDateTime created);

	void deleteAdminData(@Param("userid") String userid,@Param("created") LocalDateTime created);

}
