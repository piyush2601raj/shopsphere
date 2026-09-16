package com.shopsphere.cntrl;

import com.shopsphere.dto.CategoryDto;
import com.shopsphere.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // 📦 GET ALL
    @GetMapping
    public Map<String, Object> getAllCategories() {

        Map<String, Object> res = new LinkedHashMap<>();

        res.put("status", 200);
        res.put("message", "All categories fetched successfully");
        res.put("data", categoryService.getAllCategories());

        return res;
    }

    // 🔍 GET BY ID
    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable Long id) {

        Map<String, Object> res = new LinkedHashMap<>();

        res.put("status", 200);
        res.put("message", "Category found");
        res.put("data", categoryService.getCategoryById(id));

        return res;
    }

    // ➕ CREATE
    @PostMapping
    public Map<String, Object> create(@RequestBody CategoryDto dto) {

        Map<String, Object> res = new LinkedHashMap<>();

        res.put("status", 201);
        res.put("message", "Category created successfully");
        res.put("data", categoryService.addCategory(dto));

        return res;
    }

    // ✏️ UPDATE
    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id,
                                      @RequestBody CategoryDto dto) {

        Map<String, Object> res = new LinkedHashMap<>();

        res.put("status", 200);
        res.put("message", "Category updated successfully");
        res.put("data", categoryService.updateCategory(id, dto));

        return res;
    }

    // ❌ DELETE
    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {

        categoryService.deleteCategory(id);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "Category deleted successfully");

        return res;
    }
}