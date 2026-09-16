package com.shopsphere.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class BookImageService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public BookImageService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String getBookImage(String bookName) {

        try {
            String url = UriComponentsBuilder
                    .fromUriString("https://openlibrary.org/search.json")
                    .queryParam("title", bookName)
                    .queryParam("limit", 5)
                    .encode()
                    .toUriString();

            System.out.println("SEARCHING BOOK: " + bookName);
            System.out.println("OPEN LIBRARY URL: " + url);

            String response = restTemplate.getForObject(
                    url,
                    String.class
            );

            if (response == null || response.isBlank()) {
                return null;
            }

            JsonNode root = objectMapper.readTree(response);
            JsonNode docs = root.path("docs");

            if (!docs.isArray() || docs.isEmpty()) {
                System.out.println("NO BOOK FOUND: " + bookName);
                return null;
            }

            for (JsonNode book : docs) {

                if (book.has("cover_i")) {

                    long coverId = book
                            .get("cover_i")
                            .asLong();

                    String imageUrl =
                            "https://covers.openlibrary.org/b/id/"
                                    + coverId
                                    + "-L.jpg";

                    System.out.println(
                            "BOOK IMAGE FOUND: "
                                    + bookName
                                    + " -> "
                                    + imageUrl
                    );

                    return imageUrl;
                }
            }

            return null;

        } catch (Exception e) {

            System.out.println(
                    "BOOK IMAGE ERROR: "
                            + bookName
                            + " -> "
                            + e.getMessage()
            );

            e.printStackTrace();

            return null;
        }
    }
}