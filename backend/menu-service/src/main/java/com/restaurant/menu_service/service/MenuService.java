package com.restaurant.menu_service.service;

import com.restaurant.menu_service.dto.MenuItemResponse;
import com.restaurant.menu_service.dto.MenuItemRequest;
import java.util.List;

public interface MenuService {

    MenuItemResponse createMenuItem(MenuItemRequest request);
    List<MenuItemResponse> getAllMenuItems();
    MenuItemResponse getMenuItemById(Long id);
    MenuItemResponse updateMenuItem(Long id, MenuItemRequest request);
    void deleteMenuItem(Long id);
}
