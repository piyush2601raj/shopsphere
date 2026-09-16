package com.shopsphere.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopsphere.dto.AddressDto;
import com.shopsphere.model.Address;
import com.shopsphere.model.User;
import com.shopsphere.repository.AddressRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.AddressService;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    // ================= ADD ADDRESS =================
    @Override
    public AddressDto addAddress(AddressDto addressDto) {

        if (addressDto.getUserId() == null) {
            throw new RuntimeException("userId is required");
        }

        User user = userRepository.findById(addressDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = new Address();

        address.setFullName(addressDto.getFullName());
        address.setPhoneNumber(addressDto.getPhoneNumber());
        address.setHouseNo(addressDto.getHouseNo());
        address.setStreet(addressDto.getStreet());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setCountry(addressDto.getCountry());
        address.setPincode(addressDto.getPincode());
        address.setUser(user);

        Address saved = addressRepository.save(address);

        AddressDto res = new AddressDto();
        res.setUserId(user.getId());
        res.setFullName(saved.getFullName());
        res.setPhoneNumber(saved.getPhoneNumber());
        res.setHouseNo(saved.getHouseNo());
        res.setStreet(saved.getStreet());
        res.setCity(saved.getCity());
        res.setState(saved.getState());
        res.setCountry(saved.getCountry());
        res.setPincode(saved.getPincode());

        return res;
    }

    // ================= GET USER ADDRESSES =================
    @Override
    public List<AddressDto> getUserAddresses(Long userId) {

        if (userId == null) {
            throw new RuntimeException("userId is required");
        }

        List<Address> list = addressRepository.findByUserId(userId);

        return list.stream().map(a -> {

            AddressDto dto = new AddressDto();

            dto.setUserId(userId);
            dto.setFullName(a.getFullName());
            dto.setPhoneNumber(a.getPhoneNumber());
            dto.setHouseNo(a.getHouseNo());
            dto.setStreet(a.getStreet());
            dto.setCity(a.getCity());
            dto.setState(a.getState());
            dto.setCountry(a.getCountry());
            dto.setPincode(a.getPincode());

            return dto;

        }).toList();
    }

    // ================= ⭐ GET ALL ADDRESSES (NEW ADDED) =================
    @Override
    public List<AddressDto> getAllAddresses() {

        return addressRepository.findAll()
                .stream()
                .map(a -> {

                    AddressDto dto = new AddressDto();

                    dto.setId(a.getId()); // must exist in DTO
                    dto.setUserId(a.getUser().getId());

                    dto.setFullName(a.getFullName());
                    dto.setPhoneNumber(a.getPhoneNumber());
                    dto.setHouseNo(a.getHouseNo());
                    dto.setStreet(a.getStreet());
                    dto.setCity(a.getCity());
                    dto.setState(a.getState());
                    dto.setCountry(a.getCountry());
                    dto.setPincode(a.getPincode());

                    return dto;
                })
                .toList();
    }

    // ================= DELETE ADDRESS =================
    @Override
    public void deleteAddress(Long addressId) {

        if (addressId == null) {
            throw new RuntimeException("addressId is required");
        }

        if (!addressRepository.existsById(addressId)) {
            throw new RuntimeException("Address not found");
        }

        addressRepository.deleteById(addressId);
    }
}