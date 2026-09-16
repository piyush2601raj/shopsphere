package com.shopsphere.cntrl;

import com.shopsphere.model.ReturnRequest;
import com.shopsphere.service.ReturnService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/returns")
@CrossOrigin(origins = "http://localhost:5173")
public class ReturnController {

    private final ReturnService returnService;

    public ReturnController(ReturnService returnService) {
        this.returnService = returnService;
    }

    // =========================================================
    // CREATE RETURN / REPLACEMENT REQUEST
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createReturnRequest(

            @RequestParam Long orderId,

            @RequestParam String action,

            @RequestParam String reason,

            @RequestParam(required = false) String comment,

            // Same partner that delivered the order
            @RequestParam(required = false) String pickupPartner) {

        try {

            ReturnRequest returnRequest =
                    returnService.createReturnRequest(
                            orderId,
                            action,
                            reason,
                            comment,
                            pickupPartner
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(returnRequest);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // GET RETURN BY ORDER ID
    // =========================================================

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getReturnByOrderId(
            @PathVariable Long orderId) {

        try {

            ReturnRequest returnRequest =
                    returnService.getReturnByOrderId(orderId);

            return ResponseEntity.ok(returnRequest);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // GET RETURN BY RETURN ID
    // =========================================================

    @GetMapping("/{returnId}")
    public ResponseEntity<?> getReturnById(
            @PathVariable Long returnId) {

        try {

            ReturnRequest returnRequest =
                    returnService.getReturnById(returnId);

            return ResponseEntity.ok(returnRequest);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // UPDATE RETURN STATUS
    // =========================================================

    @PutMapping("/{returnId}/status")
    public ResponseEntity<?> updateStatus(

            @PathVariable Long returnId,

            @RequestParam String status) {

        try {

            ReturnRequest updatedReturn =
                    returnService.updateStatus(
                            returnId,
                            status
                    );

            return ResponseEntity.ok(updatedReturn);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}