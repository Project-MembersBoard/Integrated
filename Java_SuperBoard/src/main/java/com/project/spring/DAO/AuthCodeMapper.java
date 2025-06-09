package com.project.spring.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.spring.DTO.AuthCode;

@Mapper 
public interface AuthCodeMapper {
	
	void insertAuthCode(AuthCode code);
	
    AuthCode findByEmail(@Param("email") String email);
    
	void deleteByEmail(@Param("email") String email);

	void deleteExpiredCodes();

	int verifyCode(@Param("email") String email,@Param("code") String code);

}
