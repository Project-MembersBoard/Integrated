package com.project.spring.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper 
public interface LoginDAO {

	int checkByUseridAndPassword(@Param("userid") String userid,@Param("password") String enpw);

	int checkAdminByUseridAndPassword(@Param("userid") String userid,@Param("password") String enpw);

	String getNameByAdmin(@Param("userid") String userid,@Param("password") String password);

	String getNameByUser(@Param("userid") String userid,@Param("password") String password);

	String getCreatedByAdmin(@Param("userid") String userid,@Param("name") String name);
	
	String getCreatedByUser(@Param("userid") String userid,@Param("name") String name);

	void setLogin(@Param("userid") String userid);

	void setAdminLogin(@Param("userid") String userid,@Param("password") String enpw);

	boolean checkFirst(@Param("password") String password);

}
