package com.musicshop.backend.service;

import com.musicshop.backend.exception.ProductNotFoundException;
import com.musicshop.backend.model.Product;
import com.musicshop.backend.model.User;
import com.musicshop.backend.model.Wishlist;
import com.musicshop.backend.repository.ProductRepository;
import com.musicshop.backend.repository.UserRepository;
import com.musicshop.backend.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Wishlist getOrCreate(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setProducts(new ArrayList<>());
            return wishlistRepository.save(wishlist);
        });
    }

    public Wishlist addProduct(Long userId, Long productId) {
        Wishlist wishlist = getOrCreate(userId);
        Product product = productRepository.findById(productId).orElseThrow(ProductNotFoundException::new);
        if (!wishlist.getProducts().contains(product)) {
            wishlist.getProducts().add(product);
        }
        return wishlistRepository.save(wishlist);
    }

    public Wishlist removeProduct(Long userId, Long productId) {
        Wishlist wishlist = getOrCreate(userId);
        wishlist.getProducts().removeIf(product -> product.getId().equals(productId));
        return wishlistRepository.save(wishlist);
    }
}
