package com.shopsphere.cntrl;

import com.shopsphere.model.SubCategory;
import com.shopsphere.repository.SubCategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/subcategories")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class SubCategoryController {

    @Autowired
    private SubCategoryRepository repo;

    @GetMapping("/category/{id}")
    public Map<String, Object> getByCategory(
            @PathVariable Long id) {

        Map<String, Object> res =
                new LinkedHashMap<>();

        List<SubCategory> list =
                repo.findByCategory_Id(id);

        res.put("status", 200);
        res.put("message",
                "Sub Categories fetched");

        res.put("data", list);

        return res;
    }
    @GetMapping("/all")
    public Map<String, Object> getAllSubCategories() {

        Map<String, Object> res = new LinkedHashMap<>();

        List<SubCategory> list = repo.findAll();

        res.put("status", 200);
        res.put("message", "All SubCategories fetched successfully");
        res.put("data", list);

        return res;
    }
    @PostMapping("/save")
    public Map<String, Object> saveSubCategory(
            @RequestBody SubCategory subCategory) {

        Map<String, Object> res = new LinkedHashMap<>();

        SubCategory savedSubCategory = repo.save(subCategory);

        res.put("status", 201);
        res.put("message", "SubCategory created successfully");
        res.put("data", savedSubCategory);

        return res;
    }
    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteSubCategory(@PathVariable Long id) {

        Map<String, Object> res = new LinkedHashMap<>();

        repo.deleteById(id);

        res.put("status", 200);
        res.put("message", "SubCategory deleted successfully");

        return res;
    }
    @GetMapping("/duplicates")
    public Map<String, Object> getDuplicateSubCategories() {

        Map<String, Object> response = new LinkedHashMap<>();

        List<SubCategory> allSubCategories = repo.findAll();

        Map<String, List<SubCategory>> grouped = new LinkedHashMap<>();

        for (SubCategory subCategory : allSubCategories) {

            String key =
                    subCategory.getCategory().getId()
                    + "-"
                    + subCategory.getName();

            grouped
                    .computeIfAbsent(
                            key,
                            k -> new ArrayList<>()
                    )
                    .add(subCategory);
        }

        List<List<SubCategory>> duplicates =
                new ArrayList<>();

        for (List<SubCategory> list : grouped.values()) {

            if (list.size() > 1) {
                duplicates.add(list);
            }
        }

        response.put("status", 200);
        response.put("message", "Duplicate SubCategories fetched");
        response.put("data", duplicates);

        return response;
    }
}