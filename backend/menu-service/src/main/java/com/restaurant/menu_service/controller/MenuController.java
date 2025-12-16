package com.restaurant.menu_service.controller;

import com.restaurant.menu_service.dto.MenuItemRequest;
import com.restaurant.menu_service.dto.MenuItemResponse;
import com.restaurant.menu_service.model.MenuItem;
import com.restaurant.menu_service.service.MenuService;
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
    public MenuItemResponse createMenu(@Valid @RequestBody MenuItemRequest request){
        return menuService.createMenuItem(request);
    }
    @PutMapping("/{id}")
    public MenuItemResponse updateMenu(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request){
        return menuService.updateMenuItem(id, request);
    }
    @GetMapping
    public List<MenuItemResponse> getMenu() {
        return menuService.getAllMenuItems();
    }
    @GetMapping("/{id}")
    public MenuItemResponse getMenuById(@PathVariable Long id){
        return menuService.getMenuItemById(id);
    }
}
