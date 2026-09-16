package com.shopsphere.cntrl;
import com.shopsphere.service.BookImageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/book-image-test")
public class BookImageTestController {

    private final BookImageService bookImageService;

    public BookImageTestController(BookImageService bookImageService) {
        this.bookImageService = bookImageService;
    }

    @GetMapping
    public String test(@RequestParam String name) {

        System.out.println("BOOK IMAGE TEST CALLED: " + name);

        String image = bookImageService.getBookImage(name);

        if (image == null) {
            return "IMAGE NOT FOUND";
        }

        return image;
    }
}