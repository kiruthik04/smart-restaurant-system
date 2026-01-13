package com.restaurant.backend.menu.controller;

import com.restaurant.backend.menu.dto.MenuItemRequest;
import com.restaurant.backend.menu.dto.MenuItemResponse;
import com.restaurant.backend.menu.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MenuItemResponse createMenu(@Valid @RequestBody MenuItemRequest request) {
        return menuService.createMenuItem(request);
    }

    @PutMapping("/{id}")
    public MenuItemResponse updateMenu(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request) {
        return menuService.updateMenuItem(id, request);
    }

    @GetMapping
    public List<MenuItemResponse> getMenu() {
        return menuService.getAllMenuItems();
    }

    @GetMapping("/{id}")
    public MenuItemResponse getMenuById(@PathVariable Long id) {
        return menuService.getMenuItemById(id);
    }

    @GetMapping("/{id}/image")
    public org.springframework.http.ResponseEntity<byte[]> getMenuImage(@PathVariable Long id) {
        byte[] image = menuService.getMenuItemImage(id);
        if (image != null && image.length > 0) {
            return org.springframework.http.ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.IMAGE_JPEG)
                    .body(image);
        }
        return org.springframework.http.ResponseEntity.notFound().build();
    }
}
