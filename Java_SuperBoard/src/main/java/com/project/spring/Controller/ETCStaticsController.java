package com.project.spring.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.DTO.Statics;
import com.project.spring.Service.StaticsService;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true") 
@RestController
@RequestMapping("/etcstatics") 
public class ETCStaticsController {
	
	@Autowired private StaticsService staticsService;

    @PostMapping("/getStaticsYearData")
    public ResponseEntity<List<Statics>> getMonthlyStatics(@RequestBody Map<String, String> req) {
    	
        String year = req.get("year");
        
        if(year.equals("")) {
        	year = "2025";
        }

        if (year == null || year.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Statics> monthlyStatics = staticsService.getMonthlyStatics(year);
        return ResponseEntity.ok(monthlyStatics);
    }

}
