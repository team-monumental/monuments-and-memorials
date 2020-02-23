package com.monumental.controllers;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Favorite;
import com.monumental.repositories.FavoriteRepository;
import com.monumental.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

@RestController
@Transactional
public class FavoriteController {

    @Autowired
    FavoriteRepository favoriteRepository;

    @Autowired
    FavoriteService favoriteService;

    @GetMapping("/api/favorite")
    @PreAuthorize("isAuthenticated()")
    public Favorite getFavorite(@RequestParam Integer monumentId, @RequestParam(required = false) Integer userId)
            throws HttpClientErrorException.Forbidden, ResourceNotFoundException {
        return this.favoriteService.getFavorite(monumentId, userId);
    }

    @GetMapping("/api/favorites")
    @PreAuthorize("isAuthenticated()")
    public List<Favorite> getUserFavorites()
            throws HttpClientErrorException.Forbidden {
        return this.favoriteService.getUserFavorites();
    }

    @GetMapping("/api/favorites/{userId}")
    @PreAuthorize("isAuthenticated()")
    public List<Favorite> getUserFavorites(@PathVariable(value = "userId", required = false) Integer userId)
            throws HttpClientErrorException.Forbidden {
        return this.favoriteService.getUserFavorites(userId);
    }

    private static class FavoriteRequest {
        public Integer userId;
        public Integer monumentId;
    }

    @PostMapping("/api/favorite")
    @PreAuthorize("isAuthenticated()")
    public Favorite createFavorite(@RequestBody FavoriteRequest request)
            throws HttpClientErrorException.Forbidden {
        return this.favoriteService.createFavorite(request.monumentId, request.userId);
    }

    @DeleteMapping("/api/favorite")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Boolean> deleteFavorite(@RequestBody FavoriteRequest request)
            throws HttpClientErrorException.Forbidden, ResourceNotFoundException {
        this.favoriteService.deleteFavorite(request.monumentId, request.userId);
        return Map.of("success", true);
    }
}
