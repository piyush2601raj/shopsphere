package com.shopsphere.service;

import com.shopsphere.dto.ProductImportDto;

import java.util.List;

public interface ProductImportService {

    int importProducts(List<ProductImportDto> products);
}