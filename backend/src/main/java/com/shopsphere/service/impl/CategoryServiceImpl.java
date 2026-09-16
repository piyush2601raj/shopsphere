package com.shopsphere.service.impl;

import com.shopsphere.dto.CategoryDto;
import com.shopsphere.model.Category;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;

    public CategoryServiceImpl(CategoryRepository repo) {
        this.repo = repo;
    }

    private CategoryDto mapToDto(Category c) {

        CategoryDto dto = new CategoryDto();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDescription(c.getDescription());

        long count = (c.getProducts() == null)
                ? 0
                : c.getProducts().size();

        dto.setProductCount(count);

        return dto;
    }

    // CREATE
    @Override
    public CategoryDto addCategory(CategoryDto dto) {

        Category c = new Category();
        c.setName(dto.getName());
        c.setDescription(dto.getDescription());

        Category saved = repo.save(c);

        return mapToDto(saved);
    }

    // GET ALL
    @Override
    public List<CategoryDto> getAllCategories() {

        return repo.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // GET BY ID
    @Override
    public CategoryDto getCategoryById(Long id) {

        Category c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return mapToDto(c);
    }

    // UPDATE
    @Override
    public CategoryDto updateCategory(Long id, CategoryDto dto) {

        Category c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        c.setName(dto.getName());
        c.setDescription(dto.getDescription());

        Category updated = repo.save(c);

        return mapToDto(updated);
    }

    // DELETE
    @Override
    public void deleteCategory(Long id) {

        if (!repo.existsById(id)) {
            throw new RuntimeException("Category not found");
        }

        repo.deleteById(id);
    }
}