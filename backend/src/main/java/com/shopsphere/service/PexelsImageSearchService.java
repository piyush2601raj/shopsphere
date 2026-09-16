package com.shopsphere.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class PexelsImageSearchService {

    @Value("${pexels.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String searchProductImage(String productName) {

        try {
            String query = URLEncoder.encode(
                    productName,
                    StandardCharsets.UTF_8
            );

            String url =
                    "https://api.pexels.com/v1/search"
                            + "?query=" + query
                            + "&per_page=1";

            HttpHeaders headers = new HttpHeaders();

            headers.set(
                    "Authorization",
                    apiKey
            );

            HttpEntity<Void> entity =
                    new HttpEntity<>(headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            String.class
                    );

            JsonNode root =
                    objectMapper.readTree(
                            response.getBody()
                    );

            JsonNode photos =
                    root.get("photos");

            if (
                    photos == null ||
                    photos.isEmpty()
            ) {
                return "ERROR: No image found";
            }

            JsonNode firstPhoto =
                    photos.get(0);

            JsonNode src =
                    firstPhoto.get("src");

            if (
                    src == null ||
                    src.get("medium") == null
            ) {
                return "ERROR: Image URL not found";
            }

            return src
                    .get("medium")
                    .asText();

        } catch (Exception e) {

            e.printStackTrace();

            return "ERROR: " + e.getMessage();
        }
    }
}