package com.shopsphere.service.impl;

import com.shopsphere.model.Order;

import com.shopsphere.model.OrderStatus;

import com.shopsphere.model.ReturnAction;

import com.shopsphere.model.ReturnRequest;

import com.shopsphere.model.ReturnStatus;

import com.shopsphere.repository.OrderRepository;

import com.shopsphere.repository.ReturnRequestRepository;

import com.shopsphere.service.ReturnService;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.Random;

@Service

@Transactional

public class ReturnServiceImpl implements ReturnService {

    private final ReturnRequestRepository returnRequestRepository;

    private final OrderRepository orderRepository;

    public ReturnServiceImpl(

            ReturnRequestRepository returnRequestRepository,

            OrderRepository orderRepository) {

        this.returnRequestRepository = returnRequestRepository;

        this.orderRepository = orderRepository;

    }

    // =========================================================

    // CREATE RETURN / REPLACEMENT REQUEST

    // =========================================================

    @Override

    public ReturnRequest createReturnRequest(

            Long orderId,

            String action,

            String reason,

            String comment,

            String pickupPartner) {

        // Find order

        Order order = orderRepository.findById(orderId)

                .orElseThrow(() ->

                        new RuntimeException(

                                "Order not found with ID: " + orderId

                        )

                );

        // Order must be delivered

        if (order.getStatus() != OrderStatus.DELIVERED) {

            throw new RuntimeException(

                    "Return/Replacement can only be requested for a delivered order."

            );

        }

        // Check duplicate request

        if (returnRequestRepository.existsByOrderId(orderId)) {

            throw new RuntimeException(

                    "Return/Replacement request already exists for this order."

            );

        }

        // Validate action

        ReturnAction returnAction;

        try {

            returnAction = ReturnAction.valueOf(

                    action.trim().toUpperCase()

            );

        } catch (Exception e) {

            throw new RuntimeException(

                    "Invalid action. Use RETURN or REPLACEMENT."

            );

        }

        // Validate reason

        if (reason == null || reason.trim().isEmpty()) {

            throw new RuntimeException(

                    "Return/Replacement reason is required."

            );

        }

        // Create request

        ReturnRequest returnRequest = new ReturnRequest();

        returnRequest.setOrder(order);

        returnRequest.setAction(returnAction);

        returnRequest.setReason(reason.trim());

        returnRequest.setComment(

                comment != null && !comment.trim().isEmpty()

                        ? comment.trim()

                        : null

        );

        // Initial status

        if (returnAction == ReturnAction.RETURN) {

            returnRequest.setStatus(

                    ReturnStatus.RETURN_REQUESTED

            );

        } else {

            returnRequest.setStatus(

                    ReturnStatus.REPLACEMENT_REQUESTED

            );

        }

        // Request date

        returnRequest.setRequestDate(

                LocalDateTime.now()

        );

        // =====================================================

        // PICKUP DETAILS

        // =====================================================

        // Use the same logistics partner that delivered the order.
        // The frontend sends the order's delivery partner.
        // Keep a safe fallback for older callers that do not send it.
        returnRequest.setPickupPartner(
                pickupPartner != null && !pickupPartner.trim().isEmpty()
                        ? pickupPartner.trim()
                        : "Ekart Logistics"
        );

        returnRequest.setPickupExecutive(

                getRandomExecutive()

        );

        returnRequest.setPickupNumber(

                generatePickupNumber()

        );

        returnRequest.setPickupOTP(

                generateOTP()

        );

        // =====================================================

        // REFUND AMOUNT

        // =====================================================

        if (returnAction == ReturnAction.RETURN) {

            returnRequest.setRefundAmount(

                    order.getTotalAmount()

            );

        } else {

            // Replacement does not require refund

            returnRequest.setRefundAmount(0.0);

        }

        // Save to database

        return returnRequestRepository.save(returnRequest);

    }

    // =========================================================

    // GET RETURN BY ORDER ID

    // =========================================================

    @Override

    @Transactional(readOnly = true)

    public ReturnRequest getReturnByOrderId(Long orderId) {

        return returnRequestRepository

                .findByOrderId(orderId)

                .orElseThrow(() ->

                        new RuntimeException(

                                "No return/replacement request found for order ID: "

                                        + orderId

                        )

                );

    }

    // =========================================================

    // GET RETURN BY RETURN ID

    // =========================================================

    @Override

    @Transactional(readOnly = true)

    public ReturnRequest getReturnById(Long returnId) {

        return returnRequestRepository

                .findById(returnId)

                .orElseThrow(() ->

                        new RuntimeException(

                                "Return request not found with ID: "

                                        + returnId

                        )

                );

    }

    // =========================================================

    // UPDATE RETURN STATUS

    // =========================================================

    @Override

    public ReturnRequest updateStatus(

            Long returnId,

            String status) {

        // Find return request

        ReturnRequest returnRequest =

                returnRequestRepository.findById(returnId)

                        .orElseThrow(() ->

                                new RuntimeException(

                                        "Return request not found with ID: "

                                                + returnId

                                )

                        );

        // Validate status

        ReturnStatus newStatus;

        try {

            newStatus = ReturnStatus.valueOf(

                    status.trim().toUpperCase()

            );

        } catch (Exception e) {

            throw new RuntimeException(

                    "Invalid return status: " + status

            );

        }

        // Update status

        returnRequest.setStatus(newStatus);

        LocalDateTime now = LocalDateTime.now();

        // =====================================================

        // UPDATE STATUS DATES

        // =====================================================

        switch (newStatus) {

            case REQUEST_APPROVED:
            case REPLACEMENT_APPROVED:
                returnRequest.setApprovedDate(now);
                break;

            case PICKUP_SCHEDULED:

                returnRequest.setPickupDate(now);

                break;

            case PRODUCT_PICKED_UP:

                returnRequest.setPickupCompletedDate(now);

                break;

            case QUALITY_CHECK:

                returnRequest.setQualityCheckDate(now);

                break;

            case REFUND_INITIATED:

                returnRequest.setRefundInitiatedDate(now);

                break;

            case REFUND_COMPLETED:

                returnRequest.setRefundCompletedDate(now);

                break;

            default:

                break;

        }

        // Save updated request

        return returnRequestRepository.save(returnRequest);

    }

    // =========================================================

    // GENERATE 6 DIGIT OTP

    // =========================================================

    private String generateOTP() {

        Random random = new Random();

        int otp = 100000 + random.nextInt(900000);

        return String.valueOf(otp);

    }

    // =========================================================

    // GENERATE PICKUP PHONE NUMBER

    // =========================================================

    private String generatePickupNumber() {

        Random random = new Random();

        long number =

                7000000000L

                        + (long) (

                                random.nextDouble()

                                        * 2999999999L

                        );

        return String.valueOf(number);

    }

    // =========================================================

    // RANDOM PICKUP EXECUTIVE

    // =========================================================

    private String getRandomExecutive() {

        String[] executives = {

                "Rahul Sharma",

                "Amit Kumar",

                "Vikas Singh",

                "Rohit Verma",

                "Arjun Mehta"

        };

        Random random = new Random();

        return executives[

                random.nextInt(executives.length)

        ];

    }

}