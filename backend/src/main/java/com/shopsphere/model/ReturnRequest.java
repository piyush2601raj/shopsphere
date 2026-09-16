package com.shopsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "return_requests")
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnAction action;

    @Column(nullable = false)
    private String reason;

    @Column(length = 2000)
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnStatus status = ReturnStatus.RETURN_REQUESTED;

    @Column(nullable = false)
    private LocalDateTime requestDate;

    // NEW: Request approval date
    private LocalDateTime approvedDate;

    private LocalDateTime pickupDate;

    private LocalDateTime pickupCompletedDate;

    private LocalDateTime qualityCheckDate;

    private LocalDateTime refundInitiatedDate;

    private LocalDateTime refundCompletedDate;

    private String pickupPartner;

    private String pickupExecutive;

    private String pickupNumber;

    private String pickupOTP;

    private Double refundAmount;


    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public ReturnAction getAction() {
        return action;
    }

    public void setAction(ReturnAction action) {
        this.action = action;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ReturnStatus getStatus() {
        return status;
    }

    public void setStatus(ReturnStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    // NEW
    public LocalDateTime getApprovedDate() {
        return approvedDate;
    }

    // NEW
    public void setApprovedDate(LocalDateTime approvedDate) {
        this.approvedDate = approvedDate;
    }

    public LocalDateTime getPickupDate() {
        return pickupDate;
    }

    public void setPickupDate(LocalDateTime pickupDate) {
        this.pickupDate = pickupDate;
    }

    public LocalDateTime getPickupCompletedDate() {
        return pickupCompletedDate;
    }

    public void setPickupCompletedDate(LocalDateTime pickupCompletedDate) {
        this.pickupCompletedDate = pickupCompletedDate;
    }

    public LocalDateTime getQualityCheckDate() {
        return qualityCheckDate;
    }

    public void setQualityCheckDate(LocalDateTime qualityCheckDate) {
        this.qualityCheckDate = qualityCheckDate;
    }

    public LocalDateTime getRefundInitiatedDate() {
        return refundInitiatedDate;
    }

    public void setRefundInitiatedDate(LocalDateTime refundInitiatedDate) {
        this.refundInitiatedDate = refundInitiatedDate;
    }

    public LocalDateTime getRefundCompletedDate() {
        return refundCompletedDate;
    }

    public void setRefundCompletedDate(LocalDateTime refundCompletedDate) {
        this.refundCompletedDate = refundCompletedDate;
    }

    public String getPickupPartner() {
        return pickupPartner;
    }

    public void setPickupPartner(String pickupPartner) {
        this.pickupPartner = pickupPartner;
    }

    public String getPickupExecutive() {
        return pickupExecutive;
    }

    public void setPickupExecutive(String pickupExecutive) {
        this.pickupExecutive = pickupExecutive;
    }

    public String getPickupNumber() {
        return pickupNumber;
    }

    public void setPickupNumber(String pickupNumber) {
        this.pickupNumber = pickupNumber;
    }

    public String getPickupOTP() {
        return pickupOTP;
    }

    public void setPickupOTP(String pickupOTP) {
        this.pickupOTP = pickupOTP;
    }

    public Double getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(Double refundAmount) {
        this.refundAmount = refundAmount;
    }
}