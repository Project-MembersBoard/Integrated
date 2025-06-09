	package com.project.spring.config; // ← 이건 네 프로젝트에 맞춰서
	
	import org.springframework.context.annotation.Configuration;
	import org.springframework.web.servlet.config.annotation.CorsRegistry;
	import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
	
	
	@Configuration
	public class WebConfig implements WebMvcConfigurer {
	    @Override
	    public void addCorsMappings(CorsRegistry registry) {
	        registry.addMapping("/**") // 모든 경로에 대해
	                .allowedOrigins("http://localhost:3000") // React 개발 서버 주소
	                .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용 메서드
	                .allowedMethods("*")
	                .allowCredentials(true); // 쿠키 포함 허용
	    }
	}
