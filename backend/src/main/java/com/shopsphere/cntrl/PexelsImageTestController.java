package com.shopsphere.cntrl;

import com.shopsphere.service.PexelsImageSearchService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pexels-image-test")
public class PexelsImageTestController {

    private final PexelsImageSearchService imageSearchService;

    public PexelsImageTestController(
            PexelsImageSearchService imageSearchService
    ) {
        this.imageSearchService =
                imageSearchService;
    }

    @GetMapping
    public String testImage(
            @RequestParam String productName
    ) {
        return imageSearchService
                .searchProductImage(productName);
    }
}