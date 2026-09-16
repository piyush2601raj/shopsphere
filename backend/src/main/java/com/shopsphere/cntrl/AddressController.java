package com.shopsphere.cntrl;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.shopsphere.dto.AddressDto;
import com.shopsphere.service.AddressService;

@RestController
@RequestMapping("/api/address")
@CrossOrigin("*")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // ================= ADD ADDRESS =================
    @PostMapping("/add")
    public AddressDto addAddress(@RequestBody AddressDto addressDto) {
        return addressService.addAddress(addressDto);
    }

    // ================= GET ADDRESS BY USER =================
    @GetMapping("/user/{userId}")
    public List<AddressDto> getUserAddresses(@PathVariable Long userId) {
        return addressService.getUserAddresses(userId);
    }

    // ================= DELETE ADDRESS =================
    @DeleteMapping("/{addressId}")
    public String deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return "Address Deleted Successfully";
    }

    // ================= ⭐ ALL ADDRESSES (ADMIN / TEST) =================
    @GetMapping("/all")
    public List<AddressDto> getAllAddresses() {
        return addressService.getAllAddresses();
    }
}