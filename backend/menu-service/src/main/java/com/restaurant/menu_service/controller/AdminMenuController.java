package com.restaurant.menu_service.controller;

import com.restaurant.menu_service.model.MenuItem;
import com.restaurant.menu_service.service.MenuService;
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

    @PostMapping
    public MenuItem create(@RequestBody MenuItem item) {
        return menuService.create(item);
    }

    @PutMapping("/{id}")
    public MenuItem update(@PathVariable Long id, @RequestBody MenuItem item) {
        return menuService.update(id, item);
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
