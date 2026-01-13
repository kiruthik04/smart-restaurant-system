package com.restaurant.backend.menu.service;

import com.restaurant.backend.menu.dto.MenuItemResponse;
import com.restaurant.backend.menu.dto.MenuItemRequest;
import com.restaurant.backend.menu.model.MenuItem;

import java.util.List;

public interface MenuService {

    MenuItemResponse createMenuItem(MenuItemRequest request);

    List<MenuItemResponse> getAllMenuItems();

    MenuItemResponse getMenuItemById(Long id);

    MenuItemResponse updateMenuItem(Long id, MenuItemRequest request);

    void deleteMenuItem(Long id);

    List<MenuItem> getAll();

    MenuItem create(MenuItem item);

    MenuItem update(Long id, MenuItem item);

    void delete(Long id);

    void toggleAvailability(Long id);

    byte[] getMenuItemImage(Long id);
}
