package com.ailawyer.backend.dashboard.controller;

import com.ailawyer.backend.dashboard.service.CategoryService;
import com.ailawyer.backend.dashboard.projection.CategoryScoreProjection;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class CategoryController {

    private final CategoryService categoryService;
    
    @GetMapping("{category_id}/contracts")
    public ResponseEntity<Long> getContractCount(@PathVariable("category_id") Long category_id) {
        return ResponseEntity.ok(categoryService.getContractCount(category_id));
    }

    @GetMapping("{category_id}/overall")
    public ResponseEntity<CategoryScoreProjection> getAvgScoreByCategory(@PathVariable("category_id") Long category_id) {
        return ResponseEntity.ok(categoryService.getFindAvgScoreByCategoryId(category_id));
    }
}
