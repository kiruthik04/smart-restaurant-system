package com.restaurant.backend.menu.repository;

import com.restaurant.backend.menu.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
}
