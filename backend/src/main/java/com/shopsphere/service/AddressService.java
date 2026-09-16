package com.shopsphere.service;

import java.util.List;
import com.shopsphere.dto.AddressDto;

public interface AddressService {

    AddressDto addAddress(AddressDto addressDto);

    List<AddressDto> getUserAddresses(Long userId);

    void deleteAddress(Long addressId);

    // ⭐ ADD THIS
    List<AddressDto> getAllAddresses();
}