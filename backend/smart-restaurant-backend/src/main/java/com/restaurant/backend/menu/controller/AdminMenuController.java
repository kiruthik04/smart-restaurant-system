package com.restaurant.backend.menu.controller;

import com.restaurant.backend.menu.model.MenuItem;
import com.restaurant.backend.menu.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menu")
@CrossOrigin
public class AdminMenuController {

    private final MenuService menuService;

    public AdminMenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public List<MenuItem> getAll() {
        return menuService.getAll();
    }

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public MenuItem create(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("available") boolean available,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image)
            throws java.io.IOException {
        MenuItem item = new MenuItem(name, category, description, price, available);
        if (image != null && !image.isEmpty()) {
            item.setImage(image.getBytes());
        }
        return menuService.create(item);
    }

    // Changed to POST to avoid PUT Multipart issues on some containers
    @PostMapping(value = "/{id}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public MenuItem update(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("available") boolean available,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image)
            throws java.io.IOException {
        try {
            MenuItem item = new MenuItem(name, category, description, price, available);
            if (image != null && !image.isEmpty()) {
                item.setImage(image.getBytes());
            }
            return menuService.update(id, item);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{id}/image")
    public org.springframework.http.ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        byte[] image = menuService.getMenuItemImage(id);
        if (image != null && image.length > 0) {
            return org.springframework.http.ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.IMAGE_JPEG)
                    .body(image);
        }
        return org.springframework.http.ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        menuService.delete(id);
    }

    @PatchMapping("/{id}/toggle")
    public void toggleAvailability(@PathVariable Long id) {
        menuService.toggleAvailability(id);
    }
}
