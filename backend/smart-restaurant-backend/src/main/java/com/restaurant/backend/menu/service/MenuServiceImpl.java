package com.restaurant.backend.menu.service;

import com.restaurant.backend.menu.dto.MenuItemRequest;
import com.restaurant.backend.menu.dto.MenuItemResponse;
import com.restaurant.backend.menu.exception.ResourceNotFoundException;
import com.restaurant.backend.menu.model.MenuItem;
import com.restaurant.backend.menu.repository.MenuItemRepository;
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
                request.getCategory(),
                request.getDescription(),
                request.getPrice(),
                request.isAvailable());

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
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {

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
                item.getCategory(),
                item.getDescription(),
                item.getPrice(),
                item.isAvailable());
    }

    @Override
    public List<MenuItem> getAll() {
        return menuItemRepository.findAll();
    }

    @Override
    public MenuItem create(MenuItem item) {
        item.setId(null); // safety
        return menuItemRepository.save(item);
    }

    @Override
    public MenuItem update(Long id, MenuItem item) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        existing.setName(item.getName());
        existing.setDescription(item.getDescription());
        existing.setPrice(item.getPrice());
        existing.setAvailable(item.isAvailable());

        return menuItemRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        menuItemRepository.deleteById(id);
    }

    @Override
    public void toggleAvailability(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        item.setAvailable(!item.isAvailable());
        menuItemRepository.save(item);
    }

}
