package com.shopsphere.config;

import com.shopsphere.model.Category;
import com.shopsphere.model.SubCategory;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.SubCategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SubCategoryDataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;

    public SubCategoryDataSeeder(
            CategoryRepository categoryRepository,
            SubCategoryRepository subCategoryRepository) {

        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    @Override
    public void run(String... args) {

        addSubCategories("Clothing", List.of(
                "Men",
                "Women",
                "Kids",
                "Footwear"
        ));

        addSubCategories("Books", List.of(
                "Fiction",
                "Non Fiction",
                "Academic",
                "Competitive Exams"
        ));

        addSubCategories("Home & Kitchen", List.of(
                "Furniture",
                "Kitchen",
                "Home Decor",
                "Lighting"
        ));

        addSubCategories("Fashion", List.of(
                "Men Fashion",
                "Women Fashion",
                "Shoes",
                "Accessories"
        ));

        addSubCategories("Home Appliances", List.of(
                "Refrigerator",
                "Washing Machine",
                "Air Conditioner",
                "Microwave"
        ));

        addSubCategories("Mobile Phones", List.of(
                "Android Phones",
                "iPhones",
                "Mobile Accessories"
        ));

        addSubCategories("Gaming", List.of(
                "Gaming Consoles",
                "Games",
                "Gaming Accessories"
        ));

        addSubCategories("Sports & Fitness", List.of(
                "Cricket",
                "Football",
                "Gym Equipment",
                "Fitness Accessories"
        ));

        System.out.println("✅ SubCategories initialized successfully");
    }

    private void addSubCategories(
            String categoryName,
            List<String> subCategoryNames) {

        Category category = categoryRepository
                .findByName(categoryName)
                .orElse(null);

        if (category == null) {
            System.out.println(
                    "❌ Category not found: " + categoryName
            );
            return;
        }

        List<SubCategory> existing =
                subCategoryRepository.findByCategory_Id(category.getId());

        if (!existing.isEmpty()) {
            System.out.println(
                    "⏭ Already exists: " + categoryName
            );
            return;
        }

        for (String name : subCategoryNames) {

            SubCategory subCategory = new SubCategory();

            subCategory.setName(name);
            subCategory.setCategory(category);

            subCategoryRepository.save(subCategory);
        }
    }
}