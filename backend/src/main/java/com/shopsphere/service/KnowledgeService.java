package com.shopsphere.service;

import com.shopsphere.model.KnowledgeDocument;
import com.shopsphere.repository.KnowledgeDocumentRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class KnowledgeService {

    private final KnowledgeDocumentRepository repository;

    public KnowledgeService(
            KnowledgeDocumentRepository repository
    ) {
        this.repository = repository;
    }

    public List<KnowledgeDocument> getAllDocuments() {
        return repository.findAll();
    }

    public KnowledgeDocument addDocument(
            KnowledgeDocument document
    ) {
        return repository.save(document);
    }

    // ==========================================
    // KNOWLEDGE SEARCH
    // ==========================================

    public List<KnowledgeDocument> searchKnowledge(
            String query
    ) {

        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        String[] words = query
                .toLowerCase()
                .replaceAll("[^a-zA-Z0-9 ]", " ")
                .split("\\s+");

        List<KnowledgeDocument> results =
                new ArrayList<>();

        for (String word : words) {

            // Ignore common words
            if (word.length() < 3
                    || word.equals("the")
                    || word.equals("what")
                    || word.equals("are")
                    || word.equals("how")
                    || word.equals("does")
                    || word.equals("can")
                    || word.equals("tell")
                    || word.equals("about")
                    || word.equals("for")
                    || word.equals("with")
                    || word.equals("you")
                    || word.equals("and")) {

                continue;
            }

            String keyword = word;

            // Simple plural handling
            if (word.endsWith("ies")
                    && word.length() > 4) {

                keyword =
                        word.substring(
                                0,
                                word.length() - 3
                        ) + "y";

            } else if (word.endsWith("s")
                    && word.length() > 4) {

                keyword =
                        word.substring(
                                0,
                                word.length() - 1
                        );
            }

            List<KnowledgeDocument> matches =
                    repository
                            .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                                    keyword,
                                    keyword
                            );

            for (KnowledgeDocument document : matches) {

                if (!results.contains(document)) {
                    results.add(document);
                }
            }
        }

        return results;
    }
}