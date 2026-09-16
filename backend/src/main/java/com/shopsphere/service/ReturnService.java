package com.shopsphere.service;

import com.shopsphere.model.ReturnRequest;

public interface ReturnService {

    ReturnRequest createReturnRequest(
            Long orderId,
            String action,
            String reason,
            String comment,
            String pickupPartner
    );

    ReturnRequest getReturnByOrderId(Long orderId);

    ReturnRequest getReturnById(Long returnId);

    ReturnRequest updateStatus(Long returnId, String status);
}
