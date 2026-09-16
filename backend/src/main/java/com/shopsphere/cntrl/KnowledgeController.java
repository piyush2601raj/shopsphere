package com.shopsphere.cntrl;

import com.shopsphere.model.KnowledgeDocument;
import com.shopsphere.service.KnowledgeService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge")
@CrossOrigin(origins = "http://localhost:5173")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    public KnowledgeController(
            KnowledgeService knowledgeService
    ) {
        this.knowledgeService = knowledgeService;
    }

    @GetMapping("/search")
    public List<KnowledgeDocument> search(
            @RequestParam String query
    ) {
        return knowledgeService.searchKnowledge(query);
    }
}