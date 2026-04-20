package com.musicshop.backend.service;

import com.musicshop.backend.exception.ProductNotFoundException;
import com.musicshop.backend.model.Cart;
import com.musicshop.backend.model.CartItem;
import com.musicshop.backend.model.Product;
import com.musicshop.backend.model.User;
import com.musicshop.backend.repository.CartRepository;
import com.musicshop.backend.repository.ProductRepository;
import com.musicshop.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setCartItems(new ArrayList<>());
            return cartRepository.save(cart);
        });
    }

    public Cart addProduct(Long userId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId).orElseThrow(ProductNotFoundException::new);

        cart.getCartItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst()
            .ifPresentOrElse(
                item -> item.setQuantity(item.getQuantity() + quantity),
                () -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setQuantity(quantity);
                    cart.getCartItems().add(newItem);
                }
            );

        return cartRepository.save(cart);
    }

    public Cart removeProduct(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getCartItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return cartRepository.save(cart);
    }

    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
}
