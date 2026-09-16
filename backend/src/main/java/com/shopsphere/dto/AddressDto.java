package com.shopsphere.dto;

public class AddressDto {

    private Long id;   // ⭐ ADD THIS (IMPORTANT)

    private String fullName;
    private String phoneNumber;
    private String houseNo;
    private String street;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private Long userId;

    public AddressDto() {
    }

    public AddressDto(String fullName, String phoneNumber, String houseNo,
                      String street, String city, String state,
                      String country, String pincode, Long userId) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.houseNo = houseNo;
        this.street = street;
        this.city = city;
        this.state = state;
        this.country = country;
        this.pincode = pincode;
        this.userId = userId;
    }

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getHouseNo() {
        return houseNo;
    }

    public void setHouseNo(String houseNo) {
        this.houseNo = houseNo;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}