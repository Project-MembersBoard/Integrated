package com.project.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TeamProjectCommunityApplication {

	public static void main(String[] args) {
		SpringApplication.run(TeamProjectCommunityApplication.class, args);
	}

}
