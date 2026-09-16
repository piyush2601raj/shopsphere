package com.shopsphere.repository;

import com.shopsphere.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubCategoryRepository
        extends JpaRepository<SubCategory, Long> {

    List<SubCategory> findByCategory_Id(Long id);

    SubCategory findByNameAndCategory_Id(
            String name,
            Long categoryId
    );
}