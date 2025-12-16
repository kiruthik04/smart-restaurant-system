package com.restaurant.menu_service.repository;

import com.restaurant.menu_service.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long>{
}