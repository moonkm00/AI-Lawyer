package com.ailawyer.backend.dashboard.service;

import com.ailawyer.backend.dashboard.dto.TrendDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class DashboardTrendService {

    public List<TrendDto> getLast30DaysTrend() {
        List<TrendDto> trends = new ArrayList<>();
        LocalDate now = LocalDate.now();
        Random random = new Random();
        
        // Base numbers for nice realistic curves matching the mockup UI
        double baseTotal = 200;
        
        for (int i = 30; i >= 0; i--) {
            LocalDate date = now.minusDays(i);
            
            // create soft curve
            double sineVal = Math.sin((30 - i) * 0.4) * 150 + Math.cos((30 - i) * 0.2) * 80; 
            int total = (int) Math.max(0, baseTotal + sineVal + random.nextInt(40));
            int saas = (int) (total * 0.4);
            int nda = (int) (total * 0.35);
            int emp = total - saas - nda;
            
            trends.add(TrendDto.builder()
                    .date(date.format(DateTimeFormatter.ofPattern("dd")))
                    .totalContracts(total)
                    .saasContracts(saas)
                    .ndaContracts(nda)
                    .employmentContracts(emp)
                    .build());
        }
        return trends;
    }
}
