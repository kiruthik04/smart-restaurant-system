package com.restaurant.menu_service.service;

import com.restaurant.menu_service.dto.MenuItemRequest;
import com.restaurant.menu_service.dto.MenuItemResponse;
import com.restaurant.menu_service.exception.ResourceNotFoundException;
import com.restaurant.menu_service.model.MenuItem;
import com.restaurant.menu_service.repository.MenuItemRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class MenuServiceImpl implements MenuService {

    private final MenuItemRepository menuItemRepository;

    public MenuServiceImpl(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public MenuItemResponse createMenuItem(MenuItemRequest request) {

        MenuItem item = new MenuItem(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.isAvailable()
        );

        MenuItem savedItem = menuItemRepository.save(item);

        return mapToResponse(savedItem);
    }
    @Override
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        return mapToResponse(item);
    }
    @Override
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request){

        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setAvailable(request.isAvailable());

        MenuItem updatedItem = menuItemRepository.save(item);

        return mapToResponse(updatedItem);
    }
    @Override
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found");
        }
        menuItemRepository.deleteById(id);
    }
    @Override
    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private MenuItemResponse mapToResponse(MenuItem item) {
        return new MenuItemResponse(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.isAvailable()
        );
    }
}