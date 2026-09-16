package com.shopsphere.repository;

import com.shopsphere.model.KnowledgeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KnowledgeDocumentRepository
        extends JpaRepository<KnowledgeDocument, Long> {

    List<KnowledgeDocument> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String title,
            String content
    );
}