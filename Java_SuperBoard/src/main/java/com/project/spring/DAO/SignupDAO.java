package com.project.spring.DAO;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.spring.DTO.Gender;
import com.project.spring.DTO.Signup;
import com.project.spring.DTO.Status;

@Mapper 
public interface SignupDAO {

	boolean existsByUserid(@Param("userid") String userid);

//	int existsByPassword(@Param("password") String password);

	boolean existsByEmail(@Param("email") String email);

	boolean existsByMobile(@Param("mobile") String mobile);
	
	Integer findMaxId();

	int count();

	void doSignup(@Param("id") int id,@Param("userid") String userid,@Param("password") String enpw,
					@Param("mobile") String nm,@Param("email") String email,@Param("birth") String birth,
					@Param("gender") Gender g,@Param("name") String name);

	ArrayList<Signup> getAllUser();

	ArrayList<Signup> getUserData(@Param("id") String id);

	int getFilterInfo(@Param("value") String value);

	ArrayList<Signup> getFilterData(@Param("value") String value);

	Integer getDayUserCount();

	Integer getMonthUserCount();

	Integer getYearUserCount();

	String getUserid(@Param("id") String id);

	Integer checkid(@Param("userid") String userid);

	Integer checkMobile(@Param("mobile") String mobile);

	void stopAccounts(@Param("ids") List<Integer> ids);

	void activateAccounts(@Param("ids") List<Integer> ids);

	ArrayList<Signup> getFillterUser(@Param("status") Status st);

	String checkStatus(@Param("userid") String userid);

}
