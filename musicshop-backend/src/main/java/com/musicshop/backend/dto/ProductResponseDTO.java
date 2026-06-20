package com.musicshop.backend.dto;

import com.musicshop.backend.model.Product;
import java.math.BigDecimal;

/**
 * DTO zwracany przez API zamiast encji Product.
 * Zawiera nazwe kategorii jako String — eliminuje @JsonBackReference i circular references.
 */
public class ProductResponseDTO {

    private Long id;
    private String name;
    private String brand;
    private String type;
    private BigDecimal price;
    private String specs;
    private String desc;
    private String image;
    private String category;
    private Integer stockQuantity;

    public ProductResponseDTO() {}

    public static ProductResponseDTO from(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.id = product.getId();
        dto.name = product.getName();
        dto.brand = product.getBrand();
        dto.type = product.getType();
        dto.price = product.getPrice();
        dto.specs = product.getSpecs();
        dto.desc = product.getDescription();
        dto.image = product.getImageUrl();
        dto.category = product.getCategory() != null ? product.getCategory().getName() : null;
        dto.stockQuantity = product.getStockQuantity();
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getBrand() { return brand; }
    public String getType() { return type; }
    public BigDecimal getPrice() { return price; }
    public String getSpecs() { return specs; }
    public String getDesc() { return desc; }
    public String getImage() { return image; }
    public String getCategory() { return category; }
    public Integer getStockQuantity() { return stockQuantity; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setType(String type) { this.type = type; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setSpecs(String specs) { this.specs = specs; }
    public void setDesc(String desc) { this.desc = desc; }
    public void setImage(String image) { this.image = image; }
    public void setCategory(String category) { this.category = category; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
}
